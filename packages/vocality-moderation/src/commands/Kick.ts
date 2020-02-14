import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Kick implements Command {
  options: CommandOptions = {
    id: {
      name: 'kick',
    },
    description: 'Kick a user from the server',
    usage: 'kick [@user]',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('KICK_MEMBERS')) {
      msg.mentions.members?.first()?.kick();
    }
  }
}
