import io from 'socket.io';
const socketio = io();
socketio.on('connection', client => { console.log("connected") });
socketio.listen(3000);