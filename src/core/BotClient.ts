import { Client as DiscordClient, Collection, ClientOptions } from 'discord.js';
import { BOT } from '../config';
import { MessageHandler } from './handlers/MessageHandler';
import { SocketCommandHandler } from './handlers/SocketCommandHandler';
import { ServerQueueController } from './ServerQueueController';
import { Command } from '../interfaces/Command';
import * as commandDefs from '../commands';

export class BotClient extends DiscordClient {
  initTime: number;
  commands: Collection<string, Command>;
  // maybe theres a better way but undefined will do for now (i tried some stuff with Array<BotHandler> and a register method)
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
        });
      });
    });
  }

  /**
   * Uses the imported `commandDefs` to fill a collection with kv pairs.
   * key: Command name / class name
   * value: An instance of the Class from calling the constructor
   *
   * @returns {Collection<string, Command>}
   * @memberof BotClient
   */
  loadCommands(): Collection<string, Command> {
    const cmds = new Collection<string, Command>();
    Object.keys(commandDefs).forEach(name => {
      // tslint:disable-next-line: no-any
      const cmd = new ((commandDefs as ConstructorMap)[name] as any)();
      cmds.set(name.toLowerCase(), cmd);
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
