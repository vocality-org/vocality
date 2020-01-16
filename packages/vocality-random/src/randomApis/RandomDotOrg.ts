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

  number(min: number, max: number, amount: number) {
    this.checkKey();
  }

  fraction(decimals: number, amount: number) {
    this.checkKey();
  }
}

export const API_MAX_VALUE = 10e9;
