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
    usage: 'autoplay',
    description: 'bot plays continues playing songs after queue is finished',
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild!.id, msg);
  }

  run(args: string[], guildId: string, msg?: Message) {
    let serverEntry;

    if (msg) {
      serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
        msg
      );
    } else {
      serverEntry = ServerQueueController.getInstance().findOrCreateFromGuildId(
        guildId
      );
    }

    if (serverEntry.isAutoplaying) {
      serverEntry.isAutoplaying = false;
      msg?.channel.send('Autoplay is now `disabled`');
    } else {
      serverEntry.isAutoplaying = true;
      msg?.channel.send('Autoplay is now `enabled`');
    }
    onAutoplayChange(serverEntry.isAutoplaying);
  }
}
