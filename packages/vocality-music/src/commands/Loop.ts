import { Message } from 'discord.js';
// import { onLoopChange, onShuffleChange } from '../dashboard-ws';
import { ServerQueueController } from '../controller/ServerQueueController';
import { Command, CommandOptions } from '../../../vocality-types/build/src';

export class Loop implements Command {
  options: CommandOptions = {
    id: {
      name: 'loop',
    },
    description: 'If set to true it loops the current song',
    displayName: 'Loop',
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
      // onShuffleChange(serverEntry.isShuffling);
    } else {
      serverEntry.isLooping = true;
      msg.channel.send('Repeating is now `enabled`');
    }
    // onLoopChange(serverEntry.isLooping);
  }
}
