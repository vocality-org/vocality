import { ClientOptions, Command } from '@vocality-org/types';
import { BotClient } from './bot/BotClient';

const DEFAULT_OPTIONS = {
  messageCacheMaxSize: 1000,
  disabledEvents: ['TYPING_START'] as any[],
};

export class Bot {
  static bot: BotClient;

  /**
   * Creates a new instance.
   */
  constructor(options?: ClientOptions | undefined) {
    const opts = applyDefaults(options);
    Bot.bot = new BotClient(opts);
  }

  /**
   * Add custom commands to the bot.
   */
  addCommands(commands: Command[]) {
    commands.forEach(c => Bot.bot.addCommand(c));
  }

  /**
   * Loads a plugin for all guilds
   *
   * @param {boolean} [enabled] `true` by default
   */
  loadPlugin(plugin: Plugin, enabled?: boolean) {
    Bot.bot.loadPlugin(plugin, enabled !== undefined ? enabled : true);
  }

  /**
   * Start the bot.
   *
   * @param {string} [token]
   * If unset the token will be read from client options in constructor.
   */
  async start(token?: string) {
    await Bot.bot.init(token);
  }
}

function applyDefaults(o?: ClientOptions): ClientOptions {
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
