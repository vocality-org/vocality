import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';
import { BOT } from '../config';
import { CommandOptions } from '../interfaces/CommandOptions';

export class ChangePrefix implements Command {
  options: CommandOptions = {
    name: 'changePrefix <new Prefix>',
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
