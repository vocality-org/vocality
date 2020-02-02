import { Message } from 'discord.js';
import { onLoopChange, onShuffleChange } from '../dashboard-ws';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from './../types/SocketCommand';

export class Loop implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'loop',
    },
    description: 'If set to true it loops the current song',
    usage: 'Loop',
    minArguments: 0,
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

    if (serverEntry.isLooping) {
      serverEntry.isLooping = false;
      msg?.channel.send('Repeating is now `disabled`');
    } else if (!serverEntry.isLooping && serverEntry.isShuffling) {
      serverEntry.isLooping = true;
      serverEntry.isShuffling = false;
      msg?.channel.send('Repeating is now `enabled`');
      msg?.channel.send('Random play is now `disabled`');
      onShuffleChange(serverEntry.isShuffling);
    } else {
      serverEntry.isLooping = true;
      msg?.channel.send('Repeating is now `enabled`');
    }
    onLoopChange(serverEntry.isLooping);
  }
}
