import { Command } from '../interfaces/Command';
import { Message } from 'discord.js';
import { QueueContract } from '../interfaces/QueueContract';
import { ServerQueueController } from '../core/ServerQueueController';

export class Skip implements Command {
  options = {
    name: 'skip (<optional amount of songs to skip>)',
    description: 'Skip the current song',
    hasArguments: true,
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
    if (!msg.member.voiceChannel) {
      msg.channel.send('You have to be in a voice channel to stop the music!');
    } else if (!serverEntry) {
      msg.channel.send('There is no song that I could skip!');
    } else if (args[0]) {
      if (Number(args[0])) {
        const songsToSkip: number = Number.parseInt(args[0], 10);
        if (songsToSkip > serverEntry.songs.length) {
          msg.channel.send('The number is too big');
        } else {
          serverEntry.songs.splice(1, songsToSkip - 1);
          serverEntry.connection!.dispatcher.end();
        }
      } else {
        msg.channel.send('The Argument is not a number');
      }
    } else {
      serverEntry.connection!.dispatcher.end();
    }
  }
}
