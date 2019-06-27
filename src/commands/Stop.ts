import { Message } from "discord.js";
import { Command } from "../interfaces/Command";
import { QueueContract } from "../interfaces/QueueContract";
import { ServerQueueController } from "../classes/ServerQueueController";

export class Stop implements Command {
  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
    if (msg.member.voiceChannel) {
      serverEntry.songs = [];
      msg.member.voiceChannel.leave();
    }
  }
}
