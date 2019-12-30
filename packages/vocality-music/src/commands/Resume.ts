import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Resume implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'resume',
    },
    displayName: 'resume',
    description: 'Resume the bot',
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

    if (serverEntry.songs.length === 0) {
      return;
    }

    if (!serverEntry.connection!.dispatcher.paused) {
      msg?.channel.send('Nothing to Resume');
      return;
    }

    serverEntry.connection!.dispatcher.resume();
    msg?.channel.send(`**${serverEntry.songs[0].title}** resumed`);
  }
}
