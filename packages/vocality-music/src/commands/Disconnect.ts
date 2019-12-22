import { Message } from 'discord.js';
import { Command, CommandOptions } from '../../../vocality-types/build/src';

export class Disconnect implements Command {
  options: CommandOptions = {
    id: {
      name: 'disconnect',
      aliases: ['dc'],
      id: 3
    },
    displayName: 'disconnect',
    description: 'Disconnect the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    msg.member.voiceChannel.leave();
  }
}
