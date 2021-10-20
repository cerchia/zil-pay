/*
 * Project: ZilPay-wallet
 * Author: Rinat(hiccaru)
 * -----
 * Modified By: the developer formerly known as Rinat(hiccaru) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2021 ZilPay
 */
import { wrap } from 'svelte-spa-router/wrap';
import LockPage from '../pages/Lock.svelte';
import guardStore from 'popup/store/guard';

export default {
  '/': wrap({
    component: LockPage,
    conditions: [
      async () => {
        guardStore.subscribe(console.log)();

        return true;
      }
    ]
  }),

  // Catch-all
  // This is optional, but if present it must be the last
  '*': LockPage
};
