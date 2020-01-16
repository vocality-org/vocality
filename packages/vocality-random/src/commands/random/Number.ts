import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { parseMinMax } from '../../utils/parseMinMax';
import { random } from '../..';

export class Number implements Command {
  options: CommandOptions = {
    id: {
      name: 'number',
      aliases: ['num', 'int', 'integer'],
    },
    description:
      'This command generates true random integers within a user-defined range',
    usage: 'number (<min-max>) (<amount>)',
  };

  execute(msg: Message, args: string[]) {
    let min = 0;
    let max = 100;

    if (args[0]) {
      const parsed = parseMinMax(args[0]);
      if (!parsed) {
        msg.reply('Could not parse the min-max value');
        return;
      } else {
        min = parsed[0];
        max = parsed[1];
      }
    }

    const amount = isNaN(parseInt(args[1], 10)) ? 1 : parseInt(args[1], 10);

    random.randomDotOrgClient.number(min, max, amount)?.then(numbers => {
      msg.channel.send(`${numbers.join(', ')}`);
    });
  }
}
