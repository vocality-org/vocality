import { Command, CommandOptions } from '@vocality-org/types';
import { Message, RichEmbed } from 'discord.js';
import fetch from 'node-fetch';

const baseUrl = 'https://unsplash.it';

export class Image implements Command {
  options: CommandOptions = {
    id: {
      name: 'image',
    },
    description: 'This command sends a random image',
    usage: 'image (<width>) (<height>)',
  };

  execute(msg: Message, args: string[]) {
    let dimensions = '300/500';

    const width = isNaN(parseInt(args[0], 10)) ? null : args[0];
    const height = isNaN(parseInt(args[1], 10)) ? null : args[1];

    if (width) {
      dimensions = width;
    }

    if (width && height) {
      dimensions = `${width}/${height}`;
    }

    fetch(`${baseUrl}/${dimensions}`, {
      method: 'GET',
    }).then(res => {
      const embed = new RichEmbed().setImage(res.url);
      msg.channel.send({ embed });
    });
  }
}
