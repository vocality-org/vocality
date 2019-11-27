import { Command } from '../interfaces/Command';
import { CommandOptions } from '../interfaces/CommandOptions';
import { Message } from 'discord.js';
import { ServerQueueController } from '../core/ServerQueueController';
import { onLoopChange, onShuffleChange } from '../dashboard-ws';

export class Loop implements Command {
  options: CommandOptions = {
    description: 'If set to true it loops the current song',
    name: 'Loop',
    minArguments: 0,
    socketEnabled: true,
  };
  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    if (serverEntry.isLooping) {
      serverEntry.isLooping = false;
      msg.channel.send('Repeating is now `disabled`');
    } else if (!serverEntry.isLooping && serverEntry.isShuffling) {
      serverEntry.isLooping = true;
      serverEntry.isShuffling = false;
      msg.channel.send('Repeating is now `enabled`');
      msg.channel.send('Random play is now `disabled`');
      onShuffleChange(serverEntry.isShuffling);
    } else {
      serverEntry.isLooping = true;
      msg.channel.send('Repeating is now `enabled`');
    }
    onLoopChange(serverEntry.isLooping);
  }
}
