/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2021 ZilPay
 */
import { StatusCodes } from 'core/background/services/transactions';
import { TransactionTypes } from 'core/background/services/transactions/types';

export interface TxParams {
  amount: string;
  code: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  nonce: number;
  priority: boolean;
  pubKey: string;
  signature?: string;
  toAddr: string;
  version?: number;
  hash?: string;
}

export interface ParamItem {
  type: string;
  value: string | unknown[];
  vname: string;
}
export interface TxEvent {
  address: string;
  params: ParamItem[];
  _eventname: string;
}
export interface DataParams {
  params: ParamItem[];
  _tag: string;
}
export interface TransitionMessage {
  params: ParamItem[];
  _amount: string;
  _recipient: string;
  _tag: string;
}
export interface Transition {
  accepted: boolean;
  addr: string;
  depth: number;
  msg: unknown
}

export interface MinParams {
  amount: string;
  code: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  nonce?: number;
  priority?: boolean;
  version?: number;
  toAddr: string;
}

export interface TransitionReceipt {
  accepted: boolean;
  cumulative_gas: string;
  epoch_num: string;
  success: boolean;
  transitions: Transition[];
  event_logs?: TxEvent[];
  exceptions?: Array<number[]>;
  errors?: {
    line: number;
    message: string;
  }[];
}

export interface StoredTx {
  status: StatusCodes;
  confirmed?: boolean;
  token: {
    decimals: number;
    symbol: string;
  };
  recipient: string;
  success?: boolean;
  info?: string;
  teg: string;
  amount: string;
  type: TransactionTypes;
  fee: number;
  nonce: number;
  toAddr: string;
  from: string;
  hash: string;
  timestamp: number;
}