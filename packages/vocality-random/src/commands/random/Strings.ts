import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Strings implements Command {
  options: CommandOptions = {
    id: {
      name: 'strings',
    },
    description: 'This method generates true random strings',
    usage: 'strings <characters> (<amount>)',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {}
}
