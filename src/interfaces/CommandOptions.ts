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
   * The minimum amount of arguments the command expects
   */
  minArguments?: number;

  cooldown?: number;

  socketEnabled?: boolean;
}
