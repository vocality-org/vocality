import { BOT } from '@vocality-org/core';
import { Message } from 'discord.js';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class ChangePrefix implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'changePrefix',
      aliases: ['cp'],
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

  run(args: string[], guildId: string, msg?: Message) {
    throw new Error('Method not implemented.');
  }
}
