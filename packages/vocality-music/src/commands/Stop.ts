import { Message } from 'discord.js';
import { CommandOptions, Command } from '../../../vocality-types/build/src';
import { ServerQueueController } from '../controller/ServerQueueController';

export class Stop implements Command {
  options: CommandOptions = {
    id: {
      name: 'stop',
      id: 453
    },
    displayName: 'stop',
    description: 'Stop the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;

    if (msg.member.voiceChannel) {
      serverEntry.songs = [];
      msg.member.voiceChannel.leave();
    }
  }
}
