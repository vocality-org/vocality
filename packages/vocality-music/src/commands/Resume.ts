import { Message } from 'discord.js';
import { CommandOptions, Command } from '../../../vocality-types/build/src';
import { ServerQueueController } from '../controller/ServerQueueController';

export class Resume implements Command {
  options: CommandOptions = {
    id: {
      name: 'resume',
      id: 453
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
