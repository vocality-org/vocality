import { Command } from "../classes/Command";
import { Message } from "discord.js";
import { config } from "../config";
import { BotClient } from "../classes/BotClient";

export class ChangePrefix extends Command {
  execute(msg: Message, bot: BotClient): void {
    config.SERVERPREFIXES[msg.guild.id] = this.arguments[0];
    msg.channel.send(
      `prefix changed to \`${config.SERVERPREFIXES[msg.guild.id]}\``
    );
  }
}
