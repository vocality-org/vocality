import Request from 'request';
import { Song } from '../interfaces/Song';
import { YouTube } from './YouTube';

const SPOTIFY_API_URI = 'https://api.spotify.com/v1/';

export class Spotify {
  /**
   * get an access token for the Spotify API
   */
  async init() {
    const b64 = Buffer.from(
      `${process.env.SPOTIFY_ClIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');
    const authOptions: Request.CoreOptions = {
      headers: {
        Authorization: 'Basic ' + b64,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };
    Request.post(
      'https://accounts.spotify.com/api/token',
      authOptions,
      (error, response, body) => {
        process.env.SPOTIFY_ACCESS_TOKEN = body.access_token;
      }
    );
  }

  getSong(url: string) {
    return new Promise<Song | null>(async (res, rej) => {
      const songId = url.split('/')[url.split('/').length - 1];
      Request.get(
        SPOTIFY_API_URI + 'tracks/' + songId,
        {
          headers: {
            Authorization: 'Bearer ' + process.env.SPOTIFY_ACCESS_TOKEN,
            'Content-type': 'application/json',
          },
        },
        async (error, response, body) => {
          const searchString =
            JSON.parse(body).album.artists[0].name +
            '+' +
            JSON.parse(body).name;
          const yt = new YouTube();
          const song: Song | null = await yt.search(searchString);
          res(song);
        }
      );
    });
  }
}
