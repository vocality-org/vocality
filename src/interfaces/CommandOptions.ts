export interface CommandOptions {
  /**
   * Name of the Command in client format
   *
   * @example
   *  "changePrefix",
   *  "play",
   *  "skip"
   */
  name: string;

  /**
   * A short imperative description about the command.
   */
  description: string;

  /**
   * Shows if the command __needs__ at least one Argument to execute
   */
  hasArguments: boolean;

  cooldown?: number;

  socketEnabled: boolean;
}
