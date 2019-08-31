import { Message } from "discord.js";
import ytdl, { videoInfo } from "ytdl-core";
import { Command } from "../interfaces/Command";
import { QueueContract } from "../interfaces/QueueContract";
import { Song } from "../interfaces/Song";
import { ServerQueueController } from "../classes/ServerQueueController";
import { Youtube } from "../config";
import isUrl from "is-url";
import fetch from "node-fetch";
import { YouTube } from "../musicAPIs/YouTube";

/**
 *The Play Class is used to Play Music with the Bot
 *
 * @export
 * @class Play
 * @implements {Command}
 */
export class Play implements Command {
  execute(msg: Message, args: string[]): void {
    if (msg.member.voiceChannel) {
      const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
        msg
      );
      msg.member.voiceChannel.join().then(async connection => {
        serverEntry.connection = connection;
        let url: string;
        if (isUrl(args[0])) {
          url = args[0];
        } else {
          const searchParam: string = args.join("%20");
          const yt = new YouTube();
          const song: Song = await yt.search(searchParam);
          if (serverEntry.songs.length == 0) {
            serverEntry.songs.push(song);
            this.play(msg, serverEntry);
          } else {
            serverEntry.songs.push(song);
            msg.channel.send(`${song.title} has been added to the queue!`);
          }
        }
      });
    }
  }

  private play(msg: Message, serverEntry: QueueContract) {
    const song = serverEntry.songs[0];
    if (!song) {
      serverEntry.voiceChannel.leave();
      serverEntry.songs = [];
      return;
    }
    msg.channel.send(`Now playing ${song.title}`);
    const dispatcher = serverEntry
      .connection!.playStream(ytdl(song.url, { filter: "audioonly" }))
      .on("end", () => {
        serverEntry.songs.shift();
        this.play(msg, serverEntry);
      });
  }
}
