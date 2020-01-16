import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { random } from '../..';

export class String implements Command {
  options: CommandOptions = {
    id: {
      name: 'string',
    },
    description: 'This method generates true random strings',
    usage: 'string <characters> (<length>) (<amount>)',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    const characters = args[0];
    const length = isNaN(parseInt(args[1], 10)) ? 10 : parseInt(args[1], 10);
    const amount = isNaN(parseInt(args[2], 10)) ? 1 : parseInt(args[2], 10);

    random.randomDotOrgClient
      .strings(characters, length, amount)
      ?.then(string => {
        msg.channel.send(`${string.join(', ')}`);
      });
  }
}
