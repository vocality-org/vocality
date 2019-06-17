import {
  Client as DiscordClient,
  Collection,
  ClientOptions
} from "discord.js";
import { config } from "../config";
import { Command } from "../interfaces/Command";
import * as commandDefs from "../commands";

export class BotClient extends DiscordClient {
  initTime: number;
  commands: Collection<string, Command>;

  constructor(options?: ClientOptions | undefined) {
    super(options);
    this.initTime = Date.now();
    this.commands = this.loadCommands();

    this.once("ready", () => {
      this.user.setActivity(`${config.PREFIX}help`, { type: 'LISTENING' });
      this.guilds.tap(guild => {
        config.SERVERPREFIXES[guild.id] = config.PREFIX;
      });
    });
  }

  /**
   *Uses the imported `commandDefs` to fill a collection with kv pairs.
   *key: Command name / class name
   *value: An instance of the Class from calling the constructor 
   * 
   * @returns {Collection<string, Command>}
   * @memberof BotClient
   */
  loadCommands(): Collection<string, Command> {
    const cmds = new Collection<string, Command>();
    Object.keys(commandDefs).forEach(name => {
      const cmd = new ((commandDefs as ConstructorMap)[name] as any);
      cmds.set(name.toLowerCase(), cmd);
    });
    return cmds;
  }

  async init() {
    await this.login(config.TOKEN);
  }
}

interface ConstructorMap {
  [key: string]: Function
}