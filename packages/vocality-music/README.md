# Vocality Music

This is the official vocality plugin for playing Music.
The Documentation can be found here: [vocality-music documentation](https://vocality-landing-page.now.sh/plugins/music)

## Prerequesites

If you want to copy spotify links you have to pass a Spotify CLIENT_ID and a CLIENT_SECRET.

```js
music.spotify_client_id = '<your spotify CLIENT_ID>';
music.spotify_secret = '<your spotify SECRET>';
```

If you want to access Lyrics of Songs you need to pass a Genius API TOKEN.

```js
music.genius = '<<your genius API TOKEN>';
```

You also need to make sure that you have **FFMPEG** installed whereever you are going to host your bot.

## Features

- play youtube and spotify links
- search for songs
- websocket connection to use our dashboard
- skip songs
- get lyrics for song
- remove songs from queue
- change volume
- shuffle or loop the queue
- autoplay to play similar song to last one
