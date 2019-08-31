import { Youtube } from "../config";

import ytdl, { videoInfo } from "ytdl-core";

import { Song } from "../interfaces/Song";
import fetch from "node-fetch";

export class YouTube {
  constructor() {}
  /**
   * Search with the help of the YouTube API for a specific Song
   * @param {string} searchParam
   * @returns Promise<Song>
   * @memberof YouTube
   */
  public async search(searchParam: string) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${searchParam}&key=${Youtube.YOUTUBE_API_TOKEN}`
    );
    let data = await response.json();
    let videoId = data.items[0].id.videoId;
    let url = `https://www.youtube.com/watch?v=${videoId}`;

    const song: Song = await this.getInformation(url);
    const songInfo = song.title.split("-");
    if (songInfo.length !== 1) {
      if (song.songName == undefined && song.interpreters == undefined) {
        song.interpreters = songInfo[0];
        song.songName = songInfo[1].slice(
          0,
          songInfo[1].indexOf("(") != -1 ? songInfo[1].indexOf("(") : undefined
        );
      }
      if (!song.title.includes(song.songName!)) {
        song.songName = songInfo[1].slice(
          0,
          songInfo[1].indexOf("(") != -1 ? songInfo[1].indexOf("(") : undefined
        );
      }
      if (!song.title.includes(song.interpreters!)) {
        song.interpreters = songInfo[0];
      }
    }
    song.interpreters = song.interpreters!.trim().toLocaleLowerCase();
    song.songName = song.songName!.trim().toLocaleLowerCase();
    return song;
  }
  /**
   * is used to get Information for a YouTube song
   *
   * @private
   * @param {string} url
   * @returns Promise<Song>
   * @memberof YouTube
   */
  private async getInformation(url: string) {
    const video: videoInfo = await ytdl.getInfo(url);
    const video_length = Number(
      video.player_response.videoDetails.lengthSeconds
    );
    const song: Song = {
      title: video.player_response.videoDetails.title,
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
    return song;
  }
}
