class MyCommand {
  options = {
    id: {
      name: 'mc', // command identifier
    },
  };

  execute(msg, args) {
    msg.reply('thanks you for executing my command');
  }
}

module.exports = new MyCommand();
