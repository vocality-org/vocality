import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

const baseUrl = 'https://source.unsplash.com/random';

export class Image implements Command {
  options: CommandOptions = {
    id: {
      name: 'image',
    },
    description: 'This command sends a random image',
    usage: 'fraction (<width>) (<height>)',
  };

  execute(msg: Message, args: string[]) {
    const widthAndHeight = args.join('/');
    msg.channel.send('', { file: `${baseUrl}/${widthAndHeight}` });
  }
}
