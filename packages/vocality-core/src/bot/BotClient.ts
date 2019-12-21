import { Collection, ClientOptions } from 'discord.js';
import { BOT } from '../config';
import { MessageHandler } from './input-handlers/MessageHandler';
import { Client, Command } from '@vocality-org/types';

export class BotClient extends Client {
  initTime: number;
  commands: Collection<string, Command>;

  messageHandler: MessageHandler;

  constructor(options?: ClientOptions) {
    super(options);
    this.initTime = Date.now();
    this.commands = this.loadCommands();

    this.messageHandler = new MessageHandler(this);

    this.once('ready', () => {
      this.guilds.tap(guild => {
        BOT.SERVERPREFIXES[guild.id] = BOT.PREFIX;
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

    Object.keys({}).forEach(name => {
      // tslint:disable-next-line: no-any
      const cmd: Command = new (({} as ConstructorMap)[name] as any)();
      cmds.set(cmd.options.id.name, cmd);
    });

    return cmds;
  }

  /**
   * Provides a utility to for semantic command search. Returns first command
   * that has a match in either name or aliases
   */
  findCommand(search: string): Command | undefined {
    return this.commands.find((command, name) => {
      if (name === search || command.options.id.aliases?.includes(search)) {
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * Used to login the Bot with the Discord Token
   */
  async init() {
    await this.login(process.env.BOT_TOKEN);
  }
}

interface ConstructorMap {
  [key: string]: Function;
}
