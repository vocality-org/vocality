import { CommandIdentifier } from './CommandIdentifier';

export interface CommandOptions {
  id: CommandIdentifier;

  /**
   * Name of the Command in client format with arguments
   *
   * @example
   *  "help",
   *  "play <url or query>",
   *  "skip (<amount>)"
   */
  displayName: string;

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
}
