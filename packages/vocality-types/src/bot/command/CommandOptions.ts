import { CommandIdentifier } from './CommandIdentifier';
import { RichEmbed } from 'discord.js';

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
  /**
   * Pass an example input and output so it can be listed on our landing page as documentation
   * @example
   * example: {
   * input = "ping"
   * output ="pong"
   * }
   *
   */
  example?: {
    input: string;
    output: string | RichEmbed;
  };
}
