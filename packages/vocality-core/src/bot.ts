import { ClientOptions, Command, Plugin } from '@vocality-org/types';
import { BotClient } from './bot/BotClient';

const DEFAULT_OPTIONS = {
  messageCacheMaxSize: 1000,
  disabledEvents: ['TYPING_START'] as any[],
};

export class Bot {
  bot: BotClient;

  /**
   * Creates a new instance.
   */
  constructor(options?: ClientOptions | undefined) {
    const opts = applyDefaults(options);
    this.bot = new BotClient(opts);
  }

  /**
   * Add a custom command to the bot which will be enabled for all guilds.
   * Commands added this way will not belong to any plugin.
   */
  addCustomCommands(commands: Command[]) {
    commands.forEach(c => this.bot.addCommand(c));
  }

  /**
   * Remove a custom command from all guilds.
   *
   * @param {(Command | string)} command Instance or name of the command
   */
  removeCustomCommand(command: Command | string) {
    this.bot.removeCommand(command);
  }

  /**
   * Adds plugins to all guilds.
   *
   * @param {boolean} [loaded] `true` by default, for all the plugins passed
   */
  addPlugins(plugins: Plugin[], loaded?: boolean) {
    plugins.forEach(p => {
      this.bot.addPlugin(p, loaded !== undefined ? loaded : true);
    });
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
}

function applyDefaults(o?: ClientOptions): ClientOptions {
  let opts = o;

  if (!o) {
    opts = DEFAULT_OPTIONS;
  } else {
    opts = o;

    if (!o.messageCacheMaxSize) {
      opts.messageCacheMaxSize = 1000;
    } else {
      o.messageCacheMaxSize > 1000 ? 1000 : o.messageCacheMaxSize;
    }

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
