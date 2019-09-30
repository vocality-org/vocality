import io from 'socket.io-client';

const socket = io.connect('http://localhost:3000', {query: 'discordKey=NxkaCnQWCKqAXNiARcmfGMikeVHSvJ'});
socket.on('botid', (data: any) => {
    console.log(data);
})
//socket.disconnect();