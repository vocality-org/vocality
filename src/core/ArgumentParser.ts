import { BotError } from './BotError';
import { Command } from '../interfaces/Command';

const seperator = ' ';

export class ArgumentParser {
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
