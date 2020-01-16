import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

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

  execute(msg: Message, args: string[]) {}
}
