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

  /**
   * If set to true the command can be executed from a websocket connection
   */
  socketEnabled?: boolean;

  /**
   * List of possible command aliases
   */
  aliases?: string[];

  /**
   * List of the sub commands which can be called like `[prefix]parent sub`.
   * This just tells handler to treat the second argument as the command to actually execute.
   *
   * @example
   * {
   *   name: 'settings',
   *   subCommands: [
   *     'autoplay',
   *     'shuffle',
   *     ...
   *   ],
   *   ...
   * }
   */
  subCommands?: string[];
}
