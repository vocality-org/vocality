import { BotError } from './BotError';
import { Command } from '../interfaces/Command';

const seperator = ' ';

export class ArgumentParser {
  static parse (msg: string): string[] | BotError {
    if (msg.length === 0) {
      return new BotError('Empty command!');
    } else {
      return msg.split(seperator);
    }
  }

  static validateArguments(command: Command, args: string[]): BotError | void {
    if (!command.options) return;
    if (command.options.hasArguments && args.length === 0) {
      return new BotError("You didn't provide any arguments!");
    }
  }
}
