import { CommandIdentifier } from './CommandIdentifier';

export interface CommandOptions {
  readonly id: CommandIdentifier;

  /**
   * Command usage. Starts with the command name followed by the arguments.
   * optional arguments are in parenthesis.
   *
   * @example
   *  "help",
   *  "play <url or query>",
   *  "skip (<amount>)"
   */
  usage?: string;

  /**
   * A short description about the command
   */
  description?: string;

  /**
   * The minimum amount of arguments the command expects
   */
  minArguments?: number;

  cooldown?: number;
}
