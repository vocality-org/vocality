import { Client, Command, ClientOptions, Plugin } from '@vocality-org/types';
import {
  Client as DiscordClient,
  TextChannel,
  Message,
  Guild,
} from 'discord.js';
import { BOT } from '../config';
import { PluginController } from './../controllers/PluginController';
import { MessageHandler } from './input-handlers/MessageHandler';

export class BotClient extends DiscordClient implements Client {
  // private coreCommands: Command[] = [];
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
  ): Command | Command[] | undefined {
    const found: Command[] = [];

    this.pluginController.getLoadedPluginsInGuild(guildId).forEach(p => {
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

  /**
   * Adds a plugin to guilds.
   */
  addPlugin(plugin: Plugin, loaded: boolean) {
    plugin.config.loaded = loaded;
    this.guilds.forEach(g => this.pluginController.addPlugin(g.id, plugin));
  }

  /**
   * Process a input message and executes a command if found
   *
   * @param {string} guildId Specifies the guild you want the message to be for
   * @param {string} message The content of the message to process
   */
  input(guildId: string, message: string) {
    const m = this.createMessage(guildId);
    m.content = message;
    this.messageHandler.handleMessage(m);
  }

  private createMessage(guildId: string) {
    const guild = this.guilds.filter(g => g.id === guildId).first();
    const textChannel = guild.channels
      .filter(c => {
        return c.type === 'text';
      })
      .first() as TextChannel;

    const message = new Message(
      textChannel,
      { author: this.user, embeds: [], attachments: [] },
      this
    );
    return message;
  }

  /**
   * Used to login the Bot with the Discord Token
   */
  async init(token?: string) {
    if (this.opts && this.opts.plugins) {
      this.guilds.forEach(g => {
        this.pluginController.importAndAdd(g.id, this.opts!.plugins!);
      });
    }
    await this.login(token || this.token);
  }
}
