import { Client, Command, ClientOptions } from '@vocality-org/types';
import { Client as DiscordClient, TextChannel, Message } from 'discord.js';
import { BOT, DEFAULT_PLUGINS } from '../config';
import { PluginController } from './../controllers/PluginController';
import { MessageHandler } from './input-handlers/MessageHandler';

export class BotClient extends DiscordClient implements Client {
  initTime: number;
  private messageHandler: MessageHandler;

  private pluginController: PluginController;

  constructor(options?: ClientOptions) {
    super(options);
    this.initTime = Date.now();

    this.messageHandler = new MessageHandler(this);

    this.pluginController = new PluginController();
    this.guilds.forEach(g => {
      this.pluginController.load(g.id, options?.plugins || DEFAULT_PLUGINS);
    });

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

    this.pluginController.guildPlugins(guildId).forEach(p => {
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
  async init() {
    await this.login(process.env.BOT_TOKEN);
  }
}
