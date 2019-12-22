import { Message } from 'discord.js';
import { Command, CommandOptions } from '../../../vocality-types/build/src';

export class ChangePrefix implements Command {
  options: CommandOptions = {
    id: {
      name: 'changePrefix',
      aliases: ['cp'],
      id: 1
    },
    displayName: 'changePrefix <new Prefix>',
    description: 'Change the bots prefix',
    minArguments: 1,
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    BOT.SERVERPREFIXES[msg.guild.id] = args[0];
    msg.channel.send(
      `Prefix changed to \`${BOT.SERVERPREFIXES[msg.guild.id]}\``
    );
  }
}