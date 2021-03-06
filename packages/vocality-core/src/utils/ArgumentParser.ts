import { Command } from '@vocality-org/types';
import { BotError } from '../BotError';

const seperator = ' ';

export class ArgumentParser {
  /**
   * Checks if the input is empty and returns array of arguments
   */
  static parseInput(msg: string): string[] {
    if (msg.length === 0) {
      throw new BotError('Empty command!');
    } else {
      return msg.split(seperator);
    }
  }

  static validateArguments(command: Command, args: string[]) {
    if (
      command.options.minArguments &&
      command.options.minArguments > args.length
    ) {
      throw new BotError(`Expected ${command.options.minArguments} arguments.`);
    }
  }
}
