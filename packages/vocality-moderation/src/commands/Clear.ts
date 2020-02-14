import { Command, CommandOptions } from '@vocality-org/types';
import { Message, TextChannel } from 'discord.js';

export class Clear implements Command {
  options: CommandOptions = {
    id: {
      name: 'clear',
    },
    description: 'Clear a channel',
    usage: 'clear',
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
      async () => {
        const name = (msg.channel as TextChannel).name;
        const topic =
          (msg.channel as TextChannel).topic !== null
            ? (msg.channel as TextChannel).topic!
            : undefined;

        await msg.channel.delete();

        msg.guild?.channels.create(name, { type: 'text', topic: topic });
      };
    }
  }
}
