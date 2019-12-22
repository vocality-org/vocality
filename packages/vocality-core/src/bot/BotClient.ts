import { Client, Command, Handler, ClientOptions } from '@vocality-org/types';
import { Client as DiscordClient } from 'discord.js';
import { BOT, DEFAULT_PLUGINS } from '../config';
import { PluginController } from './../controllers/PluginController';
import { MessageHandler } from './input-handlers/MessageHandler';

export class BotClient extends DiscordClient implements Client {
  initTime: number;
  handlers: Handler[] = [];

  private pluginController: PluginController;

  constructor(options?: ClientOptions) {
    super(options);
    this.initTime = Date.now();

    this.handlers.push(new MessageHandler(this));

    this.pluginController = new PluginController().load(
      options?.plugins || DEFAULT_PLUGINS
    );

    this.once('ready', () => {
      this.guilds.tap(guild => {
        BOT.SERVERPREFIXES[guild.id] = BOT.PREFIX;
      });
    });
  }

  findCommand(search: string): Command | Command[] | undefined {
    const found: Command[] = [];

    this.pluginController.plugins.forEach(p => {
      p.commands?.forEach(c => {
        if (
          c.options.id.name === search ||
          c.options.id.aliases?.includes(search)
        ) {
          found.push(c);
        }
      });
    });

    if (found.length === 1) {
      return found[0];
    }

    if (found.length >= 1) {
      return found;
    }

    return undefined;
  }

  /**
   * Used to login the Bot with the Discord Token
   */
  async init() {
    await this.login(process.env.BOT_TOKEN);
  }
}
