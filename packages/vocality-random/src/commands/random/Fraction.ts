import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

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

  execute(msg: Message, args: string[]) {}
}
