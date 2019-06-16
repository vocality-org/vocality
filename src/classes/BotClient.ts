import { Client as DiscordClient, ClientOptions } from "discord.js";
import * as Discord from "discord.js";
import { config } from "../config";

export class BotClient extends DiscordClient {
  initTime: number;
  commands = new Discord.Collection<string, any>();

  constructor(options?: ClientOptions | undefined) {
    super(options ? options : undefined);
    this.initTime = Date.now();
    this.once("ready", () => {
      this.user.setActivity(`${config.PREFIX}help`);
      const allGuilds = this.guilds;
      allGuilds.tap(guild => {
        config.SERVERPREFIXES[guild.id] = config.PREFIX;
      });
    });
  }

  async init() {
    await this.login(config.TOKEN);
  }
}
