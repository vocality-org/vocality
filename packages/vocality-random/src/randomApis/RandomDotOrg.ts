import fetch from 'node-fetch';

export const API_MAX_VALUE = 10e9;

// Documentation: https://api.random.org/json-rpc/2/basic
const version = '2.0';
const invokeUrl = 'https://api.random.org/json-rpc/2/invoke';
const baseReq = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

export class RandomDotOrg {
  private _key: string | undefined;

  constructor(key?: string) {
    this._key = key;
  }

  set key(secret: string) {
    this._key = secret;
  }

  private checkKey(): boolean {
    return this._key !== undefined;
  }

  private buildRequestBody(method: string, params: any): string {
    return JSON.stringify({
      jsonrpc: version,
      method: method,
      params: {
        apiKey: this._key,
        ...params,
      },
      id: 42,
    });
  }

  number(min: number, max: number, amount: number) {
    if (!this.checkKey()) {
      return;
    }
    return fetch(invokeUrl, {
      ...baseReq,
      body: this.buildRequestBody('generateIntegers', {
        n: amount,
        min: min,
        max: max,
      }),
    })
      .then(res => res.json())
      .then(json => json.result.random.data as number[]);
  }

  fraction(decimals: number, amount: number) {
    if (!this.checkKey()) {
      return;
    }
    return fetch(invokeUrl, {
      ...baseReq,
      body: this.buildRequestBody('generateDecimalFractions', {
        n: amount,
        decimalPlaces: decimals,
      }),
    })
      .then(res => res.json())
      .then(json => json.result.random.data as number[]);
  }

  gaussian(mean: number, standardDeviation: number, amount: number) {
    if (!this.checkKey()) {
      return;
    }
    return fetch(invokeUrl, {
      ...baseReq,
      body: this.buildRequestBody('generateGaussians', {
        n: amount,
        mean: mean,
        standardDeviation: standardDeviation,
        significantDigits: 6,
      }),
    })
      .then(res => res.json())
      .then(json => json.result.random.data as number[]);
  }

  strings(characters: string, length: number, amount: number) {
    if (!this.checkKey()) {
      return;
    }
    return fetch(invokeUrl, {
      ...baseReq,
      body: this.buildRequestBody('generateStrings', {
        n: amount,
        length: length,
        characters: characters,
      }),
    })
      .then(res => res.json())
      .then(json => json.result.random.data as string[]);
  }

  uuids(amount: number) {
    if (!this.checkKey()) {
      return;
    }
    return fetch(invokeUrl, {
      ...baseReq,
      body: this.buildRequestBody('generateUUIDs', { n: amount }),
    })
      .then(res => res.json())
      .then(json => json.result.random.data as string[]);
  }
}
