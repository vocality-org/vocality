import Request from 'request';
import { Sptfy } from '../config';

export class Spotify {
    /**
     * get an access token for the Spotify API
     *@public
     *@returns void
     * @memberof Spotify
     */
    public async init() {
        const b64 = Buffer.from(`${Sptfy.SPOTIFY_ClIENT_ID}:${Sptfy.SPOTIFY_CLIENT_SECRET}`).toString('base64');
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
            (error, response, body) => (Sptfy.SPOTIFY_ACCESS_TOKEN = body.access_token),
        );
    }
}
