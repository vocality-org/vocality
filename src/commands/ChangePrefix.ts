import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';
import { config } from '../config';
import { CommandData } from '../decorators/CommandData';

@CommandData({
  name: 'ChangePrefix',
  description: '',
  cooldown: 10,
  hasArguments: true
})
export class ChangePrefix implements Command {
  execute(msg: Message, args: string[]): void {
    config.SERVERPREFIXES[msg.guild.id] = args[0];
    msg.channel.send(
      `prefix changed to \`${config.SERVERPREFIXES[msg.guild.id]}\``
    );
  }
}
