/*
 * Project: ZilPay-wallet
 * Author: Rinat(hiccaru)
 * -----
 * Modified By: the developer formerly known as Rinat(hiccaru) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2021 ZilPay
 */
import type { MinParams, StoredTx } from 'types/transaction';
import { writable } from 'svelte/store';

export default writable({
  forConfirm: [] as MinParams[],
  transactions: [] as StoredTx[]
});
