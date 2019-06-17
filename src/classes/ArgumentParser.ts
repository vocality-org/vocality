import { BotError } from './BotError';

const seperator = ' ';

export class ArgumentParser {
  static parse (msg: string): string[] | BotError {
    if (msg.length === 0) {
      return new BotError('Empty command');
    } else {
      return msg.split(seperator);
    }
  }
}
