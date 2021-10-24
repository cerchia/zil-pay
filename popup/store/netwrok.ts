/*
 * Project: ZilPay-wallet
 * Author: Rinat(hiccaru)
 * -----
 * Modified By: the developer formerly known as Rinat(hiccaru) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2021 ZilPay
 */
import { NETWORK, NETWORK_KEYS } from 'config/network';
import { writable } from 'svelte/store';

export default writable({
  config: NETWORK,
  selected: NETWORK_KEYS[0]
});
