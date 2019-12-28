import { ClientOptions } from '@vocality-org/types';
import { BotClient } from './bot/BotClient';

const DEFAULT_OPTIONS = {
  messageCacheMaxSize: 1000,
  disabledEvents: ['TYPING_START'] as any[],
};

export class Bot {
  bot: BotClient;

  /**
   * Creates a new instance of Bot.
   */
  constructor(options?: ClientOptions | undefined) {
    const opts = this.applyDefaults(options);
    this.bot = new BotClient(opts);
  }

  /**
   * Start the bot.
   *
   * @param {string} [token]
   * If unset the token will be read from client options in constructor.
   */
  async start(token?: string) {
    await this.bot.init(token);
  }

  private applyDefaults(o?: ClientOptions): ClientOptions {
    let opts = o;

    if (!o) {
      opts = DEFAULT_OPTIONS;
    } else {
      opts = o;

      opts.messageCacheMaxSize =
        (o.messageCacheMaxSize || 1000) > 1000 ? 1000 : o.messageCacheMaxSize;

      opts.disabledEvents =
        (o.disabledEvents || []).length === 0
          ? ['TYPING_START']
          : o.disabledEvents;

      if (!opts.disabledEvents?.includes('TYPING_START')) {
        opts.disabledEvents?.push('TYPING_START');
      }
    }
    return opts;
  }
}
