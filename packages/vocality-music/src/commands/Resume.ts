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
    if (ServerQueueController.getInstance().find(msg.guild.id) === undefined) {
      return;
    }

    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;

    if (serverEntry.songs.length === 0) {
      return;
    }

    if (!serverEntry.connection!.dispatcher.paused) {
      msg.channel.send('Nothing to Resume');
      return;
    }

    serverEntry.connection!.dispatcher.resume();
    msg.channel.send(`**${serverEntry.songs[0].title}** resumed`);
  }

  run(args: string[], guildId: string, msg?: Message) {
    throw new Error('Method not implemented.');
  }
}
