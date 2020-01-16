import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import faker from 'faker';

export class Word implements Command {
  options: CommandOptions = {
    id: {
      name: 'word',
    },
    description: 'This method generates random words',
    usage: 'word (<amount>)',
  };

  execute(msg: Message, args: string[]) {
    const amount = isNaN(parseInt(args[0], 10)) ? 1 : parseInt(args[0], 10);

    msg.channel.send(`${faker.random.words(amount)}`);
  }
}
