import { Message } from 'discord.js';
import { CommandOptions, Command } from '../../../vocality-types/build/src';
import { ServerQueueController } from '../controller/ServerQueueController';

export class Pause implements Command {
  options: CommandOptions = {
    id: {
      name: 'pause',
      id: 10
    },
    displayName: 'pause',
    description: 'Pause the bot',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    if (ServerQueueController.getInstance().find(msg.guild.id) === undefined) {
      return;
    }

    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
    const ss = serverEntry.connection!.dispatcher.time / 1000;
    serverEntry.connection!.dispatcher.pause();
    msg.channel.send(
      `paused **${serverEntry.songs[0].title}** at \`${new Date(ss * 1000)
        .toISOString()
        .substr(11, 8)}\``
    );
  }
}