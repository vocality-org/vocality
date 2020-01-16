import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { random } from '../..';

export class NormalDistribution implements Command {
  options: CommandOptions = {
    id: {
      name: 'gaussian',
      aliases: ['normalDistribution'],
    },
    description:
      'This method generates true random numbers from a Gaussian distribution (= normal distribution)',
    usage: 'gaussian (<mean>) (<standard deviation>) (<amount>)',
  };

  execute(msg: Message, args: string[]) {
    const mean = isNaN(parseInt(args[0], 10)) ? 0 : parseInt(args[0], 10);
    const stdDev = isNaN(parseInt(args[1], 10)) ? 1 : parseInt(args[1], 10);
    const amount = isNaN(parseInt(args[2], 10)) ? 1 : parseInt(args[2], 10);

    random.randomDotOrgClient
      .gaussian(mean, stdDev, amount)
      ?.then(gaussians => {
        msg.channel.send(`${gaussians.join(', ')}`);
      });
  }
}
