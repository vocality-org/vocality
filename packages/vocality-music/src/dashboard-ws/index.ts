import { QueueContract } from '../types/QueueContract';
import io from 'socket.io';
import fetch, { Response } from 'node-fetch';
import { Song } from '../types/Song';
import { SocketCommandMessage } from '../types/SocketCommand';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandHandler } from './../handlers/SocketCommandHandler';

const commandHandler = new SocketCommandHandler();

export let socketio = io.listen(process.env.PORT || 3000);

socketio.origins('*:*');

if (process.env.NODE_ENV === 'production') {
  socketio.use((socket: io.Socket, next) => {
    fetch('https://www.discordapp.com/api/users/@me', {
      headers: { Authorization: `Bearer ${socket.handshake.query.discordKey}` },
    }).then((response: Response) => {
      if (response.status !== 200) {
        socket.disconnect();
      } else {
        next();
      }
    });
  });
}

socketio.on('connection', (socket: io.Socket) => {
  socket.on('userGuilds', (guilds: string[]) => {
    const serverEntries = ServerQueueController.getInstance().getAll();
    const ids = Array.from(serverEntries.keys());
    const sameIds = guilds.filter(gId => ids.includes(gId));
    socket.emit('botGuilds', sameIds);
  });

  socket.on('currentGuild', (guildId: string) => {
    const queue = getServerEntryToGuildId(guildId);
    if (queue) {
      onQueueChange(queue);
      onCurrentSongChange(queue);
      socket.emit('currentState', {
        autoplay: queue.isAutoplaying,
        shuffle: queue.isShuffling,
        loop: queue.isLooping,
      });
    }
  });

  socket.on('addPlaylist', (playlistToAdd: PlayList) => {
    // const serverEntry = ServerQueueController.getInstance().find(
    //   playlistToAdd.guildId
    // );
    // const play = new Play();
    // const message = bot.socketHandler!.createMessage(playlistToAdd.guildId);
    // play.addPlaylist(playlistToAdd.songs, serverEntry, message);
  });

  socket.on('command', (command: SocketCommandMessage) => {
    try {
      commandHandler.processMessage(command);
    } catch (error) {
      socket.emit('commandError', error.message);
    }
  });
});

export function onQueueChange(queue: QueueContract) {
  if (queue && queue.songs) {
    socketio.emit('currentQueue', queue.songs.slice(1));
  }
}

export function onCurrentSongChange(queue: QueueContract) {
  if (queue && queue.connection) {
    const currentSong = queue.songs[0];

    const currentTimeMs = queue.connection!!.dispatcher.time;

    socketio.emit('currentSong', {
      current_time_ms: currentTimeMs,
      song: currentSong,
    });
  }
}

export function onLoopChange(state: boolean) {
  socketio.emit('currentLoopState', {
    state,
  });
}

export function onAutoplayChange(state: boolean) {
  socketio.emit('currentAutoplayState', {
    state,
  });
}

export function onShuffleChange(state: boolean) {
  socketio.emit('currentShuffleState', {
    state,
  });
}
export function onVolumeChange(volume: number) {
  socketio.emit('currentVolume', {
    volume,
  });
}

function getServerEntryToGuildId(guildId: string): QueueContract | undefined {
  return ServerQueueController.getInstance().find(guildId);
}

socketio.on('disconnect', (socket: io.Socket) => {});

export interface PlayList {
  songs: Song[];
  guildId: string;
}
