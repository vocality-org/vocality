import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Mute implements Command {
  options: CommandOptions = {
    id: {
      name: 'mute',
    },
    description: 'Server mute a user',
    usage: 'mute [@user]',
    minArguments: 1,
  };

  subCommands: Command[];

  constructor() {
    this.subCommands = [new Temporary()];
  }

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('MUTE_MEMBERS')) {
    }
  }
}

class Temporary implements Command {
  options: CommandOptions = {
    id: {
      name: 'temporary',
      aliases: ['temp'],
    },
    description: 'Mute a user for a given duration in seconds',
    usage: 'temporary [@user] [duration in seconds]',
    minArguments: 2,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('MUTE_MEMBERS')) {
      msg.member.voice.setMute(true);
    }
  }
}
