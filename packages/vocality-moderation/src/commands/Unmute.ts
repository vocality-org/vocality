import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Unmute implements Command {
  options: CommandOptions = {
    id: {
      name: 'unmute',
    },
    description: 'Unmute a user after a server mute',
    usage: 'unmute [@user]',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('MUTE_MEMBERS')) {
      msg.member.voice.setMute(false);
    }
  }
}
