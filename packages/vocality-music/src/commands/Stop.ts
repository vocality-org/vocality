import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Stop implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'stop',
    },
    usage: 'stop',
    description: 'Stop the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild!.id, msg);
  }

  run(args: string[], guildId: string, msg?: Message) {
    const serverEntry = ServerQueueController.getInstance().find(guildId)!;

    serverEntry.songs = [];

    if (msg?.member?.voice.channel) {
      msg.member.voice.channel.leave();
    }
  }
}
