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
    if (!command.options) return;
    if (command.options.hasArguments && args.length === 0) {
      throw new BotError("You didn't provide any arguments!");
    }
  }
}
