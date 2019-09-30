export interface CommandOptions {
  /**
   * Name of the Command in client format
   * 
   * @example
   *  "changePrefix",
   *  "play",
   *  "skip"
   * @type {string}
   * @memberof CommandOptions
   */
  name: string;

  /**
   * A short imperative description about the command.
   *
   * @type {string}
   * @memberof CommandOptions
   */
  description: string;

  /**
   * Shows if the command __needs__ at least one Argument to execute
   *
   * @type {boolean}
   * @memberof CommandOptions
   */
  hasArguments: boolean;

  cooldown?: number;
}
