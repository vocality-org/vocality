import Request from 'request';
import { SPOTIFY } from '../config';

export class Spotify {
  /**
   * get an access token for the Spotify API
   */
  async init() {
    const b64 = Buffer.from(
      `${SPOTIFY.SPOTIFY_ClIENT_ID}:${SPOTIFY.SPOTIFY_CLIENT_SECRET}`
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
      (error, response, body) =>
        (SPOTIFY.SPOTIFY_ACCESS_TOKEN = body.access_token)
    );
  }
}
