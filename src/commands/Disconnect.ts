import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';

export class Disconnect implements Command {
  options = {
    name: 'disconnect',
    description: 'Disconnect the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    msg.member.voiceChannel.leave();
  }
}
