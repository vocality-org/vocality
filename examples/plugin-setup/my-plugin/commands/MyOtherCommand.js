class MyOtherCommand {
  options = {
    id: {
      name: 'moc', // command identifier
    },
  };

  execute(msg, args) {
    msg.reply('thanks you for executing my other command');
  }
}

module.exports = new MyOtherCommand();
