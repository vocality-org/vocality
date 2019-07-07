import { Message } from "discord.js";
import ytdl, { videoInfo } from "ytdl-core";
import { Command } from "../interfaces/Command";
import { QueueContract } from "../interfaces/QueueContract";
import { Song } from "../interfaces/Song";
import { ServerQueueController } from "../classes/ServerQueueController";
import { Youtube } from "../config";
import isUrl from "is-url";
import fetch from "node-fetch";

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
        console.log(isUrl(args[0]));
        if (isUrl(args[0])) {
          url = args[0];
        } else {
          const searchParam: string = args.join("%20");
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${searchParam}&key=${
              Youtube.YOUTUBE_API_TOKEN
            }`
          );
          let data = await response.json();
          console.log(data.items);
          let videoId = data.items[0].id.videoId;
          url = `https://www.youtube.com/watch?v=${videoId}`;
        }
        const video: videoInfo = await ytdl.getInfo(url);
        const video_length = Number(video.length_seconds);
        console.log(video);
        const song: Song = {
          title: video.title,
          songName: video.media.song,
          interpreters: video.media.artist,
          length_ms: video_length * 1000,
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
        if (song.songName == undefined && song.interpreters == undefined) {
          const songInfo = song.title.split("-");
          song.interpreters = songInfo[0];
          song.songName = songInfo[1].slice(0, songInfo.indexOf("("));
        }
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
