import { Client as DiscordClient, Collection, ClientOptions } from 'discord.js';
import { BOT } from '../config';
import { MessageHandler } from './input-handlers/MessageHandler';
import { SocketCommandHandler } from './input-handlers/SocketCommandHandler';
import { ServerQueueController } from './ServerQueueController';
import { Command } from '../interfaces/Command';

import * as commandDefs from '../commands';

export class BotClient extends DiscordClient {
  initTime: number;
  commands: Collection<string, Command>;

  socketHandler: SocketCommandHandler;
  messageHandler: MessageHandler;

  constructor(options?: ClientOptions) {
    super(options);
    this.initTime = Date.now();
    this.commands = this.loadCommands();

    this.messageHandler = new MessageHandler(this);
    this.socketHandler = new SocketCommandHandler(this);

    this.once('ready', () => {
      this.guilds.tap(guild => {
        BOT.SERVERPREFIXES[guild.id] = BOT.PREFIX;
        ServerQueueController.getInstance().add(guild.id, {
          songs: [],
          textChannel: null,
          voiceChannel: null,
          connection: null,
          isLooping: false,
          isShuffling: false,
          currentlyPlaying: 0,
          isAutoplaying: false,
          volume: 0.5,
        });
      });
    });
  }

  /**
   * Uses the imported `commandDefs` to fill a collection with kv pairs.
   *
   * key: Command `options.id.name`
   * value: Command instance
   *
   * @returns {Collection<string, Command>}
   * @memberof BotClient
   */
  loadCommands(): Collection<string, Command> {
    const cmds = new Collection<string, Command>();

    Object.keys(commandDefs).forEach(name => {
      // tslint:disable-next-line: no-any
      const cmd: Command = new ((commandDefs as ConstructorMap)[name] as any)();
      cmds.set(cmd.options.id.name, cmd);
    });

    return cmds;
  }

  /**
   * Used to login the Bot with the Discord Token
   */
  async init() {
    await this.login(BOT.TOKEN);
  }
}

interface ConstructorMap {
  [key: string]: Function;
}
