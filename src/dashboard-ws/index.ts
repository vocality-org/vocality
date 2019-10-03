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
        const serverEntry = ServerQueueController.getInstance().find(guildId)!!;
        if (serverEntry) {
            const currentSong = serverEntry.songs[0];
            socket.emit('currentQueue', serverEntry.songs);
            if (currentSong) {
                socket.emit('currentSong', {
                    title: currentSong.title,
                    url: currentSong.url,
                    thumbnail_url: currentSong.thumbnail_url,
                    requested_by: currentSong.requested_by,
                    max_time_ms: currentSong.length_ms,
                    current_time_ms: serverEntry.connection!!.dispatcher.time,
                });
            }
        }
    });
    socket.on('command', (command: SocketCommand) => {
        bot.socketHandler!.handleSocketCommand(command);
    });
});

socketio.on('disconnect', (socket: io.Socket) => {
    console.log('socket disconnected');
});

export interface SocketCommand {
    name: string;
    args: string[];
    messageData: any;
}
