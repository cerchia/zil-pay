/*
 * Project: ZilPay-wallet
 * Author: Rinat(hiccaru)
 * -----
 * Modified By: the developer formerly known as Rinat(hiccaru) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2021 ZilPay
 */
import type { DataParams, TransitionReceipt, TxParams } from 'types/transaction';

import assert from 'assert';
import BN from 'bn.js';
import Long from 'long';
import { Validator, CryptoUtils } from './crypto';
import { Gas } from 'config/gas';
import { TypeOf } from 'lib/type/type-checker';

export interface TransactionParams extends TxParams {
  ContractAddress?: string;
  senderAddress?: string;
  TranID?: string;
  ID?: string;
  from?: string;
  receipt?: TransitionReceipt;
  Info?: string;
}

export class Transaction {
  public version: number;
  public toAddr: string;
  public nonce: number;
  public amount: BN;
  public code: string;
  public data: DataParams | null;
  public signature: string;
  public ContractAddress: string;
  public ID: string;
  public from: string;
  public Info: string;
  public pubKey: string;
  public gasPrice: BN;
  public gasLimit: Long;
  public priority: boolean;
  public receipt: TransitionReceipt;

  public epoch?: string;
  public cumulativeGas?: string;
  public success?: boolean;

  public get payload() {
    const address = CryptoUtils.fromBech32Address(this.toAddr);

    return {
      amount: String(this.amount),
      gasPrice: String(this.gasPrice),
      gasLimit: String(this.gasLimit),
      code: this.code,
      data: this.data ? JSON.stringify(this.data) : '',
      nonce: this.nonce,
      priority: this.priority,
      toAddr: CryptoUtils.toHex(address),
      version: this.version,
      signature: this.signature
    };
  }

  public get txParams() {
    return this.payload;
  }

  public get TranID() {
    return this.ID;
  }

  public get exceptions() {
    if (!this.receipt || !this.receipt.exceptions) {
      return [];
    }

    return this.receipt.exceptions;
  }

  public get errors() {
    if (!this.receipt || !this.receipt.errors) {
      return [];
    }

    return this.receipt.errors;
  }

  public get eventLogs() {
    if (!this.receipt || !this.receipt.event_logs) {
      return []
    }

    return this.receipt.event_logs
  }

  constructor(params: TransactionParams, priority = false) {
    this.version = params.version;
    this.toAddr = params.toAddr;
    this.nonce = Number(params.nonce || 0);
    this.amount = new BN(params.amount || 0);
    this.code = params.code || '';
    this.signature = params.signature;
    this.ContractAddress = params.ContractAddress;
    this.ID = params.TranID || params.ID;
    this.from = params.from || params.senderAddress;
    this.Info = params.Info;
    this.pubKey = params.pubKey;

    this.gasPrice = new BN(params.gasPrice || Gas.gasPrice ** 3);
    this.gasLimit = Long.fromNumber(Number(params.gasLimit || Gas.gasLimit));

    this.priority = params.priority;
    this.priority = priority;
    this.receipt = params.receipt;

    assert(Boolean(this.toAddr), 'toAddr is requered.');

    if (Validator.isAddress(this.toAddr)) {
      this.toAddr = CryptoUtils.toChecksumAddress(this.toAddr);
      this.toAddr = CryptoUtils.toBech32Address(this.toAddr);
    }

    if (params.data && TypeOf.isString(params.data)) {
      this.data = JSON.parse(params.data);
    } else {
      this.data = null;
    }

    if (this.receipt) {
      this.epoch = this.receipt.epoch_num;
      this.cumulativeGas = this.receipt.cumulative_gas;
      this.success = this.receipt.success;
    }

    if (this.data && Array.isArray(this.data)) {
      this.data.params = this.data.params.map((arg, index) => {
        try {
          if (arg && arg.type === 'ByStr20' && arg.value && Validator.isBech32(arg.value)) {
            arg.value = CryptoUtils.fromBech32Address(String(arg.value));
          }

          if (arg && arg.type === 'List (ByStr20)' && Array.isArray(arg.value)) {
            arg.value = arg.value.map((address) => {
              if (!Validator.isBech32(address)) {
                return address;
              }

              address = CryptoUtils.fromBech32Address(String(address));

              return address;
            })
          }
        } catch (err) {
          throw new Error(`${err.message} in param ${index}, type: ${arg.type}, value: ${arg.value}`);
        }

        return arg;
      })
    }
  }
}

export class TransactionFactory {
  new(params: TransactionParams, priority = false) {
    return new Transaction(params, priority);
  }
}