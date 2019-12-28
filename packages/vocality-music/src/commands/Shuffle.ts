import { Message } from 'discord.js';
import { onShuffleChange, onLoopChange } from '../dashboard-ws';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Shuffle implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'shuffle',
    },
    displayName: 'shuffle',
    description: 'Shuffles the current queue',
    socketEnabled: true,
    minArguments: 0,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    if (serverEntry.isShuffling) {
      serverEntry.isShuffling = false;
      msg.channel.send('Random play is now `disabled`');
    } else if (serverEntry.isLooping && !serverEntry.isShuffling) {
      serverEntry.isLooping = false;
      serverEntry.isShuffling = true;
      msg.channel.send('Random play is now `enabled`');
      msg.channel.send('Repeating is now `disabled`');
      onLoopChange(serverEntry.isLooping);
    } else {
      serverEntry.isShuffling = true;
      msg.channel.send('Random play is now `enabled`');
    }
    onShuffleChange(serverEntry.isShuffling);
  }

  run(args: string[], guildId: string, msg?: Message) {
    throw new Error('Method not implemented.');
  }
}
