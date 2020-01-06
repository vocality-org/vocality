export interface CommandIdentifier {
  /**
   * Command name. This is the main command identifier.
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
