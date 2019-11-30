import { Command } from '../interfaces/Command';
import { Message } from 'discord.js';
import { CommandOptions } from '../interfaces/CommandOptions';
import { ServerQueueController } from '../core/ServerQueueController';
import { onAutoplayChange } from '../dashboard-ws';

export class AutoPlay implements Command {
  options: CommandOptions = {
    id: {
      name: 'autoplay',
      aliases: ['auto'],
    },
    displayName: 'autoplay',
    description: 'bot plays continues playing songs after queue is finished',
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
}
