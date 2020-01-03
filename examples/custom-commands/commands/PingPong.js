class PingPong {
  options = {
    id: {
      name: 'ping', // command identifier
    },
    displayName: 'ping',
    maxArguments: 0,
  };

  execute(msg, args) {
    msg.repl('pong');
  }
}

module.exports = new PingPong();
