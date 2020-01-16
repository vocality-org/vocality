import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Uuid implements Command {
  options: CommandOptions = {
    id: {
      name: 'uuid',
    },
    description:
      'This method generates true random Universally Unique IDentifiers (UUIDs) in accordance with section 4.4 of RFC 4122',
    usage: 'uuid (<amount>)',
  };

  execute(msg: Message, args: string[]) {}
}
