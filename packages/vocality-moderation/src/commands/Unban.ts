import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Unban implements Command {
  options: CommandOptions = {
    id: {
      name: 'unban',
    },
    description: 'Unbans a user',
    usage: 'unban [@user]',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('BAN_MEMBERS')) {
      const candidate = msg.mentions.members?.first();

      if (candidate) {
        async () => {
          await msg.guild?.members.unban(candidate);
        };
      }
    }
  }
}
