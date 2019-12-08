/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import { FIELDS, ZILLIQA } from 'config'
import { BrowserStorage, BuildObject } from 'lib/storage'

import fetch from 'cross-fetch'

import errorsCode from './errors'

const defaultSelected = Object.keys(ZILLIQA)[0]

export class NetworkControl {

  /**
   * @return nodeURL.
   */
  get provider() {
    return this.config[this.selected].PROVIDER
  }

  /**
   * @return Number, blockchain version.
   */
  get version() {
    return this.config[this.selected].MSG_VERSION
  }

  constructor(config = ZILLIQA, selected = defaultSelected) {
    this.config = config
    this.selected = selected
    this.status = null
    this._storage = new BrowserStorage()
  }

  /**
   * Change the network.
   * @param {String} selected - Can be only (mainnet, testnet, private).
   */
  async changeNetwork(selected) {
    if (!(selected in this.config)) {
      throw new Error(
        `${errorsCode.changeNetwork}
         ${Object.keys(this.config)}`
      )
    }

    await this._storage.set(
      new BuildObject(FIELDS.SELECTED_NET, selected)
    )

    this.selected = selected

    await this.checkProvider()

    return {
      selected,
      config: this.config,
      provider: this.provider
    }
  }

  /**
   * Change Zilliqa network config.
   * @param {Object} config - Zilliqa config object.
   */
  async changeConfig(config = ZILLIQA) {
    if (!new TypeError(config).isObject) {
      throw new Error(
        `${errorsCode.changeNetwork} ${typeof config}`
      )
    }

    await this._storage.set(
      new BuildObject(FIELDS.CONFIG, config)
    )

    this.config = config

    await this.checkProvider()

    return this.config
  }

  /**
   * Synchronize with storage.
   */
  async netwrokSync() {
    const { config, selectednet } = await this._storage.get([
      FIELDS.SELECTED_NET,
      FIELDS.CONFIG
    ])

    if (config) {
      this.config = config
    }

    if (selectednet) {
      this.selected = selectednet
    }

    return {
      config,
      selected: this.selected
    }
  }

  /**
   * Call the options requests to node URL.
   */
  async checkProvider() {
    try {
      const response = await fetch(this.provider, {
        method: 'OPTIONS',
        cache: 'no-cache',
        mode: 'cors'
      })

      await response.json()

      this.status = true
    } catch (err) {
      this.status = false
    }

    return this.status
  }

}
