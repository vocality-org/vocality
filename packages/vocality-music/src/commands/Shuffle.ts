import { Message } from 'discord.js';
import { onShuffleChange, onLoopChange } from '../dashboard-ws';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Shuffle implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'shuffle',
    },
    usage: 'shuffle',
    description: 'Shuffles the current queue',
    socketEnabled: true,
    minArguments: 0,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild.id, msg);
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

    if (serverEntry.isShuffling) {
      serverEntry.isShuffling = false;
      msg?.channel.send('Random play is now `disabled`');
    } else if (serverEntry.isLooping && !serverEntry.isShuffling) {
      serverEntry.isLooping = false;
      serverEntry.isShuffling = true;
      msg?.channel.send('Random play is now `enabled`');
      msg?.channel.send('Repeating is now `disabled`');
      onLoopChange(serverEntry.isLooping);
    } else {
      serverEntry.isShuffling = true;
      msg?.channel.send('Random play is now `enabled`');
    }
    onShuffleChange(serverEntry.isShuffling);
  }
}
