//@ts-ignore
import io from 'socket.io';
//@ts-ignore
import fetch, { Response } from 'node-fetch';
import { ServerQueueController } from '../bot/classes/ServerQueueController';
const socketio = io.listen(process.env.PORT || 3000);
socketio.origins('*:*');
socketio.use((socket: io.Socket, next: any) => {
    fetch('https://www.discordapp.com/api/users/@me', { headers: {'Authorization': `Bearer ${socket.handshake.query.discordKey}`}}).then((response: Response) => {
        if(response.status != 200) {
            socket.disconnect();
        } else {
            next();
        }
    })
 })
socketio.on("connection", function(socket: io.Socket) {
    socket.on('userGuilds', (guilds: string[]) => {
        let serverEntries = ServerQueueController.getInstance().getAll();
        console.log(serverEntries);
        let ids = Array.from(serverEntries.keys())
        let sameIds = guilds.filter(gId => ids.includes(gId));
        socket.emit('botGuilds', sameIds);
    })
    socket.on('currentGuild', (guildId: string) => {
        const serverEntry = ServerQueueController.getInstance().find(guildId)!!;
        if(serverEntry) {
            const currentSong = serverEntry.songs[0];
            socket.emit('currentQueue', serverEntry.songs);
            socket.emit('currentSong', {title: currentSong.title, thumbnail_url: currentSong.thumbnail_url, requested_by: currentSong.requested_by, max_time_ms: currentSong.length_ms, current_time_ms: serverEntry.connection!!.dispatcher.time})
        }
        
        
    })
  });

socketio.on('disconnect', (socket: io.Socket) => {
    console.log('socket disconnected');
})