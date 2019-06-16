import { Command } from "../classes/Command";
import { Message } from "discord.js";
import { BotClient } from "../classes/BotClient";

export class Stop extends Command {
  execute(msg: Message, bot: BotClient): void {
    msg.member.voiceChannel.leave();
  }
}
