export interface CommandOptions {
  /**
   * Name of the Command in client format with arguments
   *
   * @example
   *  "help",
   *  "play <url or query>",
   *  "skip (<amount>)"
   */
  name: string;

  /**
   * A short description about the command.
   */
  description: string;

  /**
   * The minimum amount of arguments the command expects
   */
  minArguments?: number;

  cooldown?: number;

  socketEnabled?: boolean;
}
