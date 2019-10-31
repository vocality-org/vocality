import io from 'socket.io-client';

setInterval(() => io.connect('https://bass-bot-app.herokuapp.com/'), 300000);

/*
Vielleicht müssn wa einmal connecten weil socketio für disconnect detection so 
an ping einbaut hat. Bei der connection kann man de parameter setzen.
Option	        Default value	Description
pingInterval	25000	        how many ms before sending a new ping packet
pingTimeout	    5000	        how many ms without a pong packet to consider the connection closed
https://socket.io/docs/server-api/
Disconnect Detection: https://socket.io/docs/
*/
