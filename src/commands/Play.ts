import { Message } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../interfaces/Command";

export class Play implements Command {
  execute(msg: Message, args: string[]): void {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then(connection => {
        const stream = ytdl("https://youtu.be/pqIv3e5eBeo", {
          filter: "audioonly"
        });
        const dispatcher = connection.playStream(stream);
      });
    } else {
      msg.reply("You are not in a Voice Channel");
    }
  }
}
