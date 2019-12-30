export class MyCommand {
  options = {
    id: {
      name: 'mycommand', // command identifier
    },
  };

  execute(msg, args) {
    msg.reply('thanks you for executing my command');
  }
}
