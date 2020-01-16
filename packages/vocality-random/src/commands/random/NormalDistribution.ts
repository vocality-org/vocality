import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class NormalDistribution implements Command {
  options: CommandOptions = {
    id: {
      name: 'gaussian',
      aliases: ['normalDistribution'],
    },
    description:
      'This method generates true random numbers from a Gaussian distribution (= normal distribution)',
    usage: 'gaussian (<mean = 0>) (<standard derivation = 1>)',
  };

  execute(msg: Message, args: string[]) {}
}
