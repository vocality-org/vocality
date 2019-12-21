import { BotClient } from '../BotClient';
import { Handler } from '@vocality-org/types';

export class BotHandler implements Handler {
  bot: BotClient;

  constructor(bot: BotClient) {
    this.bot = bot;
  }
}
