import { Message } from "discord.js";
import ytdl, { videoInfo } from "ytdl-core";
import { Command } from "../interfaces/Command";
import { QueueContract } from "../interfaces/QueueContract";
import { ServerQueue } from "../classes/ServerQueue";
import { Song } from "../interfaces/Song";
/**
 *The Play Class is used to Play Music with the Bot
 *
 * @export
 * @class Play
 * @implements {Command}
 */
export class Play implements Command {
  execute(msg: Message, args: string[], serverEntry: QueueContract): void {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then(async connection => {
        serverEntry.connection = connection;
        const video: videoInfo = await ytdl.getInfo(args[0]);
        const video_length = Number(video.length_seconds);
        const song: Song = {
          title: video.title,
          url: video.video_url,
          length: new Date(video_length * 1000).toISOString().substr(11, 8),
          thumbnail_url:
            video.player_response.videoDetails.thumbnail.thumbnails[
              video.player_response.videoDetails.thumbnail.thumbnails.length - 1
            ].url,
          author: {
            name: video.author.name,
            avatarURL: video.author.avatar,
            channelUrl: video.author.channel_url
          }
        };
        if (serverEntry.songs.length == 0) {
          serverEntry.songs.push(song);
          this.play(msg, serverEntry);
        } else {
          serverEntry.songs.push(song);
          msg.channel.send(`${song.title} has been added to the queue!`);
        }
      });
    }
  }
  play(msg: Message, serverEntry: QueueContract) {
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
