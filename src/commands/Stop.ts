import { Message } from "discord.js";
import { Command } from "../interfaces/Command";
import { QueueContract } from "../interfaces/QueueContract";

export class Stop implements Command {
  execute(msg: Message, args: string[], serverEntry: QueueContract): void {
    if (msg.member.voiceChannel) {
      serverEntry.songs = [];
      msg.member.voiceChannel.leave();
    }
  }
}
