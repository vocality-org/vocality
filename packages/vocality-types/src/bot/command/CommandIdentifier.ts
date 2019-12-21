export interface CommandIdentifier {
  /**
   * Unique id
   */
  readonly id: number;

  /**
   * Command name in camelCase
   *
   * @type {string}
   * @memberof CommandIdentifier
   */
  readonly name: string;

  /**
   * Possible command aliases
   *
   * @type {string[]}
   * @memberof CommandIdentifier
   */
  readonly aliases?: string[];
}
