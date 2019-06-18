import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';

export class Stop implements Command {
  execute (msg: Message, args: string[]): void {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.leave();
    }
  }
}
