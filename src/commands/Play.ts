import { Command } from "../classes/Command";
import { Message } from "discord.js";
import { BotClient } from "../classes/BotClient";
import ytdl from "ytdl-core";
import * as fs from "fs";
import { WriteStream } from "tty";

export class Play extends Command {
  execute(msg: Message, bot: BotClient): void {
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
