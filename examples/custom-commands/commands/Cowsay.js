import * as cowsay from 'cowsay';

// "cowsay <message>"
export class Cowsay {
  options = {
    id: {
      name: 'cowsay', // command identifier
    },
    displayName: 'cow (say/think) <message>',
    description: 'A talking to an ascii cow',
  };

  subCommands;

  constructor() {
    this.subCommands.push(new Say());
    this.subCommands.push(new Think());
  }

  execute(msg, args) {
    msg.reply(cowsay.say(args[0]));
  }
}

// "cowsay say <message>"
class Say {
  options = {
    id: {
      name: 'say', // subcommand identifier
    },
  };

  execute(msg, args) {
    msg.reply(cowsay.say(args[0]));
  }
}

// "cowsay think <message>"
class Think {
  options = {
    id: {
      name: 'think', // subcommand identifier
    },
  };

  execute(msg, args) {
    msg.reply(cowsay.think(args[0]));
  }
}
