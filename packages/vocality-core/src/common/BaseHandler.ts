import { BotClient } from '../bot/BotClient';
import { Handler } from '@vocality-org/types';

export abstract class BaseHandler<T> implements Handler<T> {
  bot: BotClient;

  constructor(bot: BotClient) {
    this.bot = bot;
  }

  /**
   * Processes the message
   */
  handle(message: T) {
    this.processMessage(message);
  }

  protected abstract processMessage(message: T): void;
}
