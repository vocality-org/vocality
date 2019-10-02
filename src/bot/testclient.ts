import io from 'socket.io-client';

setInterval(() => io.connect('https://bass-bot-app.herokuapp.com/'), 300000)