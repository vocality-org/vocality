import {
  Client,
  Command,
  ClientOptions,
  Plugin,
  CommandSearchResult,
  CommandType,
} from '@vocality-org/types';
import {
  Client as DiscordClient,
  TextChannel,
  Message,
  Guild,
} from 'discord.js';
import { BOT } from '../config';
import { PluginController } from './../controllers/PluginController';
import { MessageHandler } from './input-handlers/MessageHandler';
import { loadCommands } from '../utils/loadCommands';

import * as coreCommandsModule from '../commands';

export class BotClient extends DiscordClient implements Client {
  /**
   * All the core commands are stored here. Core commands are globally enabled
   * across all guilds.
   */
  private coreCommands: Command[] = [];

  /**
   * Only commands added with the addCommand method are stored here.
   * The commands are like coreCommands globally available across all guilds and
   * can not be disabled. Only by removing them with the removeCommand method.
   */
  private customCommands: Command[] = [];

  private messageHandler: MessageHandler;

  pluginController: PluginController;
  opts: ClientOptions | undefined;

  constructor(options?: ClientOptions) {
    super(options);
    this.opts = options;

    if (options?.token) {
      this.token = options.token;
    }

    this.coreCommands = loadCommands(coreCommandsModule);

    this.messageHandler = new MessageHandler(this);
    this.pluginController = new PluginController();

    this.once('ready', () => {
      this.guilds.tap(guild => {
        BOT.SERVERPREFIXES[guild.id] = BOT.PREFIX;
      });
    });
  }

  findCommand(
    guildId: string,
    search: string
  ): CommandSearchResult | CommandSearchResult[] | undefined {
    const found: CommandSearchResult[] = [];

    const filter = (c: Command) => {
      return (
        c.options.id.name === search || c.options.id.aliases?.includes(search)
      );
    };

    // search core commands
    this.coreCommands.filter(filter).forEach(c =>
      found.push({
        command: c,
        type: CommandType.CoreCommand,
      })
    );

    // search custom commands
    this.customCommands.filter(filter).forEach(c =>
      found.push({
        command: c,
        type: CommandType.CustomCommand,
      })
    );

    // search loaded plugin commands
    this.pluginController.getLoadedPluginsInGuild(guildId).forEach(p => {
      p.commands?.filter(filter).forEach(c =>
        found.push({
          command: c,
          plugin: p,
          type: CommandType.PluginCommand,
        })
      );
    });

    return found.length === 0
      ? undefined
      : found.length === 1
      ? found[0]
      : found;
  }

  findGuild(guildId: string): Guild | undefined {
    return this.guilds.get(guildId);
  }

  addCommand(command: Command) {
    this.customCommands.push(command);
  }

  removeCommand(command: Command | string) {
    if (typeof command === 'string') {
      this.customCommands = this.customCommands.filter(
        c => c.options.id.name !== command
      );
    } else {
      this.customCommands.splice(this.customCommands.indexOf(command), 1);
    }
  }

  addPlugin(plugin: Plugin, loaded: boolean) {
    plugin.config.loaded = loaded;
    this.guilds.forEach(g => this.pluginController.addPlugin(g.id, plugin));
  }

  /**
   * Used to login the Bot with the Discord Token
   */
  async init(token?: string) {
    if (this.opts && this.opts.plugins) {
      this.guilds.forEach(g => {
        this.opts!.plugins!.forEach(p => {
          this.pluginController.addPlugin(g.id, p);
        });
      });
    }
    await this.login(token || this.token);
  }
}
