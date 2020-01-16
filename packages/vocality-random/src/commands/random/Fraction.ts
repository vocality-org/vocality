import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { random } from '../..';

export class Fraction implements Command {
  options: CommandOptions = {
    id: {
      name: 'fraction',
      aliases: ['frac'],
    },
    description:
      'This command generates true random decimal fractions from a uniform distribution across the [0,1] interval with a user-defined number of decimal places',
    usage: 'fraction (<decimalPlaces>) (<amount>)',
  };

  execute(msg: Message, args: string[]) {
    const decimals = isNaN(parseInt(args[0], 10)) ? 3 : parseInt(args[0], 10);
    const amount = isNaN(parseInt(args[1], 10)) ? 1 : parseInt(args[1], 10);

    random.randomDotOrgClient.fraction(decimals, amount)?.then(decimals => {
      msg.channel.send(`${decimals.join(', ')}`);
    });
  }
}
