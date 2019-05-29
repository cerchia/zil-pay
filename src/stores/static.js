import { MTypesInternal } from '../../lib/messages/messageTypes'
import { Message } from '../../lib/messages/messageCall'
import networkConfig from '../../config/zil.json'
import { BrowserStorage, BuildObject } from '../../lib/storage'
import fields from '../../config/fields'
import API from '../../config/api.json'

async function updateStatic(object, isOverwrite=false) {
  const storage = new BrowserStorage();
  let stateData = await storage.get(fields.STATIC);
  stateData = stateData[fields.STATIC];

  if (!stateData || Object.keys(stateData).length < 3 || isOverwrite) {
    await storage.set(new BuildObject(fields.STATIC, {
      currency: object.currency,
      addressFormat: object.addressFormat,
      defaultGas: object.defaultGas,
      lockTime: object.lockTime
    }));
    return null;
  }

  return Object.assign(object, stateData);
}

export default {
  namespaced: true,
  state: {
    lockTime: API.TIME_BEFORE_LOCK, // in hours.
    currency: 'USD',
    currencyItems: ['BTC', 'USD'],

    addressFormat: 'Bech32',
    addressFormatItems: ['Bech32', 'Base58', 'Base16'],

    network: 'mainnet',
    networkConfig,

    defaultGas: {
      gasPrice: 1000, // in LI
      gasLimit: 1
    }
  },
  mutations: {
    mutateLockTime(state, newTime) {
      state.lockTime = newTime;
      updateStatic(state, true);
    },
    mutateGasLimit(state, newGasLimit) {
      state.defaultGas.gasLimit = newGasLimit;
      updateStatic(state, true);
    },
    mutateGasPrice(state, newGasPrice) {
      state.defaultGas.gasPrice = newGasPrice;
      updateStatic(state, true);
    },
    mutateCurrency(state, newMutateCurrency) {
      state.currency = newMutateCurrency;
      updateStatic(state, true);
    },
    mutateAddressFormat(state, newAddressFormat) {
      state.addressFormat = newAddressFormat;
      updateStatic(state, true);
    },
    mutateNetwork(state, newNetwork) {
      state.network = newNetwork;
    },
    mutateNetworkConfig(state, newConfig) {
      state.networkConfig = newConfig;
    }
  },
  actions: {
    async stateUpdate({ state }) {
      state = await updateStatic(state);
    },
    async changeNetwork({ commit, rootState }, selectednet) {
      const type = MTypesInternal.SET_NET;
      const payload = { selectednet };
      const provider = networkConfig[selectednet].PROVIDER;
    
      if (!provider) {
        return null;
      }
      
      rootState.isConnect = await new Message({ type, payload }).send();

      commit('mutateNetwork', selectednet);
    },
    async configUpdate({ commit }, config) {
      const type = MTypesInternal.CONFIG_UPDATE;
      const payload = { config };
    
      const status = await new Message({ type, payload }).send();
    
      if (status.resolve) {
        commit('mutateNetworkConfig', config);
      } else {
        throw new Error(status.reject);
      }
    }
  }
}