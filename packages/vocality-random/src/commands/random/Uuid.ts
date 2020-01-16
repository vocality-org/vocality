import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { random } from '../..';

export class Uuid implements Command {
  options: CommandOptions = {
    id: {
      name: 'uuid',
    },
    description:
      'This method generates true random Universally Unique IDentifiers (UUIDs) in accordance with section 4.4 of RFC 4122',
    usage: 'uuid (<amount>)',
  };

  execute(msg: Message, args: string[]) {
    const amount = isNaN(parseInt(args[0], 10)) ? 1 : parseInt(args[0], 10);

    random.randomDotOrgClient.uuids(amount)?.then(uuids => {
      msg.channel.send(`${uuids.map(u => `\`${u}\``).join('\n')}`);
    });
  }
}
