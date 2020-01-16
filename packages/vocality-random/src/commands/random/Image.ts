import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Image implements Command {
  options: CommandOptions = {
    id: {
      name: 'image',
    },
    description: 'This command sends a random image',
    usage: 'fraction (<width and heigth>)',
  };

  execute(msg: Message, args: string[]) {}
}
