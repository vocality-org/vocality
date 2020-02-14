import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

export class Ban implements Command {
  options: CommandOptions = {
    id: {
      name: 'ban',
    },
    description: 'Ban a user from the server',
    usage: 'ban [@user] (message)',
    minArguments: 1,
  };

  subCommands: Command[];

  constructor() {
    this.subCommands = [new Temporary()];
  }

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('BAN_MEMBERS')) {
      msg.mentions.members?.first()?.ban({ reason: args[1] });
    }
  }
}

class Temporary implements Command {
  options: CommandOptions = {
    id: {
      name: 'temporary',
      aliases: ['temp'],
    },
    description:
      'Ban a user from the server for a given duration in days. If no duration is given the ban is for 1 day',
    usage: 'temporary [@user] (message) (duration in days) ',
    minArguments: 2,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('BAN_MEMBERS')) {
      const days = isNaN(parseInt(args[2], 10)) ? 1 : parseInt(args[2], 10);
      msg.mentions.members?.first()?.ban({ days: days, reason: args[1] });
    }
  }
}
