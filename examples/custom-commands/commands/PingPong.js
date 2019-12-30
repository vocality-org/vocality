export class Cowsay {
  options = {
    id: {
      name: 'ping', // command identifier
    },
    displayName: 'ping',
    maxArguments: 0,
  };

  execute(msg, args) {
    msg.reply('pong');
  }
}
