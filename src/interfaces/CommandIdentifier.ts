export interface CommandIdentifier {
  /**
   * Unique command name in camelCase
   *
   * @type {string}
   * @memberof CommandIdentifier
   */
  name: string;

  /**
   * Possible command aliases
   *
   * @type {string[]}
   * @memberof CommandIdentifier
   */
  aliases?: string[];
}
