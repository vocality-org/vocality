import cheerio from 'cheerio';
import ytdl, { videoInfo } from 'ytdl-core';

import { Song } from '../interfaces/Song';
import fetch from 'node-fetch';

export class YouTube {
  constructor() {}
  /**
   * Search with the help of the YouTube API for a specific Song
   * @param {string} searchParam
   * @returns Promise<Song>
   * @memberof YouTube
   */
  async search(searchParam: string) {
    const websiteData = await fetch(
      `https://www.youtube.com/results?search_query=${searchParam}`
    );
    const website = await websiteData.text();
    const $ = cheerio.load(website);
    let url = '';
    const result = $('a');
    for (const element of result.toArray()) {
      if (
        element.attribs['href'].includes('watch') &&
        !element.attribs['href'].includes('googleadservices')
      ) {
        url = `https://www.youtube.com${element.attribs['href']}`;
        break;
      }
    }
    const song: Song | null = await this.getInformation(url);
    if (song) {
      const songInfo = song.title.split('-');
      if (songInfo.length !== 1) {
        if (song.songName === undefined && song.interpreters === undefined) {
          song.interpreters = songInfo[0];
          song.songName = songInfo[1].slice(
            0,
            songInfo[1].indexOf('(') !== -1
              ? songInfo[1].indexOf('(')
              : undefined
          );
        }
        if (!song.title.includes(song.songName!)) {
          song.songName = songInfo[1].slice(
            0,
            songInfo[1].indexOf('(') !== -1
              ? songInfo[1].indexOf('(')
              : undefined
          );
        }
        if (!song.title.includes(song.interpreters!)) {
          song.interpreters = songInfo[0];
        }
      }
      if (song.interpreters) {
        song.interpreters = song.interpreters!.trim().toLocaleLowerCase();
      }
      if (song.songName) {
        song.songName = song.songName!.trim().toLocaleLowerCase();
      }
    }
    return song;
  }

  /**
   * is used to get Information for a YouTube song
   *
   * @param {string} url
   * @returns Promise<Song>
   * @memberof YouTube
   */
  async getInformation(url: string): Promise<Song | null> {
    return new Promise((resolve, reject) => {
      ytdl.getInfo(url, (err: Error, video: videoInfo) => {
        if (video) {
          const videoLength = Number(
            video.player_response.videoDetails.lengthSeconds
          );
          const song: Song = {
            title: video.player_response.videoDetails.title,
            songName: video.media.song,
            interpreters: video.media.artist,
            length_ms: videoLength * 1000,
            url: video.video_url,
            length: new Date(videoLength * 1000).toISOString().substr(11, 8),
            thumbnail_url:
              video.player_response.videoDetails.thumbnail.thumbnails[
                video.player_response.videoDetails.thumbnail.thumbnails.length -
                  1
              ].url,
            author: {
              name: video.author.name,
              avatarURL: video.author.avatar,
              channelUrl: video.author.channel_url,
            },
            requested_by: '',
          };
          resolve(song);
        } else {
          resolve(null);
        }
      });
    });
  }
  parseYoutubeUrl(url: string) {
    const regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/,
      match = url.match(regExp);

    return match !== null ? true : false;
  }
  getYtPlaylist(urls: string[]) {
    return new Promise<Array<Song | null>>((resolve, rej) => {
      const songArray: Array<Promise<Song | null>> = [];
      urls.forEach(link => {
        songArray.push(this.getInformation(link));
      });
      Promise.all(songArray).then(songs => {
        resolve(songs);
      });
    });
  }
  async autoplay(song: Song) {
    return new Promise<Song | null>(async (res, rej) => {
      const websiteData = await fetch(song.url);
      const website = await websiteData.text();
      const $ = cheerio.load(website);
      const result = $('body')
        .find('#content')
        .find('.related-list-item')
        .find('a')
        .attr('href');
      const url = `https://www.youtube.com${result}`;
      const nextSong = await this.getInformation(url);
      res(nextSong);
    });
  }
}
