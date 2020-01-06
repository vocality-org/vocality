import { Message } from 'discord.js';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';
import { QueueContract } from '../types/QueueContract';
import { Song } from '../types/Song';
import ytdl from 'ytdl-core';
//@ts-ignore
import ytList from 'youtube-playlist';
import { ServerQueueController } from '../controller/ServerQueueController';
import { YouTube } from '../musicAPIs/YouTube';
import { Spotify } from '../musicAPIs/Spoitfy';
import { onCurrentSongChange, onQueueChange } from '../dashboard-ws';
import { BotError } from '@vocality-org/core';

/**
 * The Play Class is used to Play Music with the Bot
 */
export class Play implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'play',
      aliases: ['p', 'pl'],
    },
    usage: 'play <link or searchstring>',
    description: 'Play a song',
    minArguments: 1,
    socketEnabled: true,
  };

  async execute(msg: Message, args: string[]): Promise<void> {
    this.run(args, msg.guild.id, msg);
  }

  private async play(
    serverEntry: QueueContract,
    lastSong: Song,
    msg?: Message
  ) {
    let song: Song | null = null;
    if (serverEntry.isShuffling) {
      const randomSong = Math.floor(
        Math.random() * serverEntry.songs.length + 1
      );
      song = serverEntry.songs[randomSong];
      serverEntry.currentlyPlaying = randomSong;
    } else {
      song = serverEntry.songs[0];
      serverEntry.currentlyPlaying = 0;
    }

    if (!song && !serverEntry.isAutoplaying) {
      serverEntry.voiceChannel!.leave();
      serverEntry.songs = [];
      return;
    } else if (!song && serverEntry.isAutoplaying) {
      const yt = new YouTube();
      song = await yt.autoplay(lastSong);
      serverEntry.songs.push(song as Song);
    }

    msg?.channel.send(`Now playing **${song!.title}**`);

    serverEntry
      .connection!.playStream(ytdl(song!.url, { filter: 'audioonly' }), {
        volume: serverEntry.volume,
      })
      .on('end', () => {
        let lastSong: Song | undefined;
        if (!serverEntry.isLooping && !serverEntry.isShuffling) {
          lastSong = serverEntry.songs.shift();
        } else if (serverEntry.isLooping) {
        } else if (serverEntry.isShuffling) {
          lastSong = serverEntry.songs.splice(
            serverEntry.currentlyPlaying,
            1
          )[0];
        }
        this.play(serverEntry, lastSong as Song, msg);
        onQueueChange(serverEntry);
      });

    onCurrentSongChange(serverEntry);
  }

  private addSong(song: Song, serverEntry: QueueContract, msg?: Message) {
    if (msg) {
      song.requested_by = msg.author.username;
    } else {
      song.requested_by = 'Vocality Dashboard'; // man könnt bei messageData im socket event den user mitgeben
    }

    if (serverEntry.songs.length === 0) {
      serverEntry.songs.push(song);
      this.play(serverEntry, song, msg);
    } else {
      serverEntry.songs.push(song);
      msg?.channel.send(`**${song.title}** has been added to the queue!`);
      onQueueChange(serverEntry);
    }
  }

  addPlaylist(
    songs: Song[],
    serverEntry: QueueContract | undefined,
    msg?: Message
  ) {
    if (msg) {
      songs.forEach(song => {
        song.requested_by = msg.author.username;
      });
    } else {
      songs.forEach(song => {
        song.requested_by = 'Vocality Dashboard';
      });
    }

    if (serverEntry!.songs.length === 0) {
      serverEntry!.songs = songs;
      this.play(serverEntry!, serverEntry!.songs[0], msg);
    } else {
      serverEntry!.songs.push(...songs);
      onQueueChange(serverEntry!);
    }
  }

  async run(args: string[], guildId: string, msg?: Message) {
    if (msg && !msg.member.voiceChannel) {
      msg.channel.send('Please join a voice channel');
      return;
    }

    let serverEntry;
    if (msg) {
      serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
        msg
      );
    } else {
      serverEntry = ServerQueueController.getInstance().findOrCreateFromGuildId(
        guildId
      );
    }

    if (msg) {
      const connection = await msg.member.voiceChannel.join();
      serverEntry.connection = connection;
    } else {
      throw new BotError('First play of guild cant be from Dashboard!');
    }

    const yt = new YouTube();
    let song: Song | null;

    if (yt.parseYoutubeUrl(args[0])) {
      if (args[0].includes('playlist')) {
        const result = await ytList(args[0], 'url');
        const maxLength: number = result.data.playlist.length;
        const batchSize = 5;
        const playListLinks: string[] = result.data.playlist;
        msg?.channel.send(`${maxLength} Songs have been added to the Queue`);
        for (let i = 0; i <= maxLength; i += batchSize) {
          let songs = await yt.getYtPlaylist(
            playListLinks.slice(
              i,
              i + batchSize > maxLength ? maxLength : i + batchSize
            )
          );
          songs = songs.filter(songs => songs != null);
          this.addPlaylist(songs as Song[], serverEntry, msg);
        }
      } else {
        const url = args[0];
        song = await yt.getInformation(url);
        if (song) this.addSong(song, serverEntry, msg);
      }
    } else if (/^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/.test(args[0])) {
      if (process.env.SPOTIFY_ACCESS_TOKEN) {
        const sptfy = new Spotify();
        const song = await sptfy.getSong(args[0]);
        if (song) this.addSong(song, serverEntry, msg);
      } else {
        msg?.channel.send(
          'Spotify not supported for this bot please visit {url} for a tutorial on how to enable Spotify for the bot'
        );
      }
    } else {
      const searchParam: string = args.join('+');
      song = await yt.search(searchParam);
      if (song) this.addSong(song, serverEntry, msg);
    }
  }
}
