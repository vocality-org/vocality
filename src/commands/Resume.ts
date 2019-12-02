import { Command } from '../interfaces/Command';
import { Message } from 'discord.js';
import { ServerQueueController } from '../core/ServerQueueController';

export class Resume implements Command {
  options = {
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
}
