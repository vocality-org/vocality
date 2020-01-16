import { Command, CommandOptions } from '@vocality-org/types';
import { Message, RichEmbed } from 'discord.js';

const baseUrl = 'https://source.unsplash.com/random';

export class Image implements Command {
  options: CommandOptions = {
    id: {
      name: 'image',
    },
    description: 'This command sends a random image',
    usage: 'fraction (<width>x<height>)',
  };

  execute(msg: Message, args: string[]) {
    const embed = new RichEmbed().setImage(`${baseUrl}/${args[0]}`);
    console.log(`${baseUrl}/${args[0]}`);

    msg.channel.send({ embed });
  }
}
