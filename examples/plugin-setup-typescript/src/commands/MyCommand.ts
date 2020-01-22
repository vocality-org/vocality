import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class MyCommand implements Command {
  options: CommandOptions = {
    id: {
      name: 'mc',
    },
  };

  execute(msg: Message, args: string[]) {
    msg.reply('thanks you for executing my command');
  }
}
