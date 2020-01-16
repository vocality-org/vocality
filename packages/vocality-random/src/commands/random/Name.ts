import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import faker from 'faker';

export class Name implements Command {
  options: CommandOptions = {
    id: {
      name: 'name',
    },
    description: 'This command generates a random name',
    usage: 'name)',
  };

  execute(msg: Message, args: string[]) {
    msg.channel.send(`${faker.name.findName()}`);
  }
}
