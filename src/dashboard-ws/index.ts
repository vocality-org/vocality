import { QueueContract } from './../interfaces/QueueContract';
import { Song } from './../interfaces/Song';
import { bot } from './../bot';
import io from 'socket.io';
import fetch, { Response } from 'node-fetch';
import { ServerQueueController } from '../core/ServerQueueController';

const socketio = io.listen(process.env.PORT || 3000);
socketio.origins('*:*');

socketio.use((socket: io.Socket, next: any) => {
    fetch('https://www.discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${socket.handshake.query.discordKey}` },
    }).then((response: Response) => {
        if (response.status != 200) {
            socket.disconnect();
        } else {
            next();
        }
    });
});

socketio.on('connection', function(socket: io.Socket) {
    socket.on('userGuilds', (guilds: string[]) => {
        let serverEntries = ServerQueueController.getInstance().getAll();
        let ids = Array.from(serverEntries.keys());
        let sameIds = guilds.filter(gId => ids.includes(gId));
        socket.emit('botGuilds', sameIds);
    });
    socket.on('currentGuild', (guildId: string) => {
        console.log(guildId);
        onQueueChange(undefined, guildId);
        onCurrentSongChange(undefined, guildId);
    });
    socket.on('command', (command: SocketCommand) => {
        try {
            bot.socketHandler!.handleSocketCommand(command);
        } catch (error) {
            socket.emit('commandError', error);
        }
    });
});

// Um auch von den commands aus emiten zu können hab i mal auf schnell de 2 functions gmacht
// Schaut halt ned schön aus wegn dem ServerQueueController des müsst man bei gelegenheit mal umbauen glaub i
// spätest beim sharding, wenn man nimmer alle guilds in einm array speichern kann wird der als erstes probleme machn

export function onQueueChange(serverEntry?: QueueContract, guildId?: string) {
    if (!serverEntry && !guildId) return;

    let queue: QueueContract = serverEntry!;
    if (!serverEntry) {
        queue = ServerQueueController.getInstance().find(guildId!)!;
    }

    if (queue.songs) {
        socketio.emit('currentQueue', queue.songs.slice(1));
    }
}

export function onCurrentSongChange(serverEntry?: QueueContract, guildId?: string) {
    if (!serverEntry && !guildId) return;

    let queue: QueueContract = serverEntry!;
    if (!serverEntry) {
        queue = ServerQueueController.getInstance().find(guildId!)!;
    }

    if (queue.connection) {
        const currentSong = queue.songs[0];

        const currentTimeMs = queue.connection!!.dispatcher.time;

        socketio.emit('currentSong', {
            title: currentSong.title,
            url: currentSong.url,
            thumbnail_url: currentSong.thumbnail_url,
            requested_by: currentSong.requested_by,
            max_time_ms: currentSong.length_ms,
            current_time_ms: currentTimeMs,
        });
    }
}

socketio.on('disconnect', (socket: io.Socket) => {
    console.log('socket disconnected');
});

export interface SocketCommand {
    name: string;
    args: string[];
    messageData: any;
}