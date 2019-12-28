import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Stop implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'stop',
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

  run(args: string[], guildId: string, msg?: Message) {
    throw new Error('Method not implemented.');
  }
}
