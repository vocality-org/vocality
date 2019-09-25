import io from 'socket.io';
import fetch from 'node-fetch';
const socketio = io();
socketio.origins('*:*');
socketio.use(async (socket) => {
    const response = await fetch('https://www.discordapp.com/api/users/@me', { headers: {'Authorization': `Bearer ${socket.handshake.query.discordKey}`}})
    if(response.status != 200) {
        socket.disconnect();
    }
})
socketio.on('connection', client => { console.log("connected") });
socketio.listen(3000);