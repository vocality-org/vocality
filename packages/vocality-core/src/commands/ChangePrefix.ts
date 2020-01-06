import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { BOT } from '../config';

export class ChangePrefix implements Command {
  options: CommandOptions = {
    id: {
      name: 'prefix',
    },
    usage: 'prefix <character>',
    description: 'Change the bot message prefix for this server',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    BOT.SERVERPREFIXES[msg.guild.id] = args[0];
    msg.channel.send(
      `Prefix changed to \`${BOT.SERVERPREFIXES[msg.guild.id]}\``
    );
  }
}
