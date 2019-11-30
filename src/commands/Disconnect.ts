import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';

export class Disconnect implements Command {
  options = {
    id: {
      name: 'disconnect',
      aliases: ['dc'],
    },
    displayName: 'disconnect',
    description: 'Disconnect the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    msg.member.voiceChannel.leave();
  }
}
