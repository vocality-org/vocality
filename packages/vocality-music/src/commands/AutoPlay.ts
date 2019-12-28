import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { onAutoplayChange } from '../dashboard-ws';
import { SocketCommand } from '../types/SocketCommand';

export class AutoPlay implements SocketCommand {
  options = {
    id: {
      name: 'autoplay',
      aliases: ['auto'],
    },
    displayName: 'autoplay',
    description: 'bot plays continues playing songs after queue is finished',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    if (serverEntry.isAutoplaying) {
      serverEntry.isAutoplaying = false;
      msg.channel.send('Autoplay is now `disabled`');
    } else {
      serverEntry.isAutoplaying = true;
      msg.channel.send('Autoplay is now `enabled`');
    }
    onAutoplayChange(serverEntry.isAutoplaying);
  }

  run(args: string[], guildId: string, msg?: Message) {
    throw new Error('Method not implemented.');
  }
}
