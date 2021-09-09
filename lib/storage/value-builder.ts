/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2021 ZilPay
 */
import { TypeOf } from 'lib/type/type-checker';

export interface StorageKeyValue {
  [key: string]: string;
}
/**
 * Through this class can build payload for write to browser Storage.
 * @example
 * import { buildObject, BrowserStorage } from 'lib/storage'
 * new BrowserStorage().set([
 *  buildObject('key', 'any payload or object or array')
 * ])
 */
export function buildObject(key: string, value: string | object): StorageKeyValue {
  let data = value;

  if (TypeOf.isObject(value) || TypeOf.isArray(value)) {
    data = JSON.stringify(data);
  }

  return {
    [key]: String(data)
  };
}
