import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Pause implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'pause',
    },
    usage: 'pause',
    description: 'Pause the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild.id, msg);
  }

  run(args: string[], guildId: string, msg?: Message) {
    if (ServerQueueController.getInstance().find(guildId) === undefined) {
      return;
    }

    const serverEntry = ServerQueueController.getInstance().find(guildId)!;
    const ss = serverEntry.connection!.dispatcher.time / 1000;
    serverEntry.connection!.dispatcher.pause();
    msg?.channel.send(
      `paused **${serverEntry.songs[0].title}** at \`${new Date(ss * 1000)
        .toISOString()
        .substr(11, 8)}\``
    );
  }
}
