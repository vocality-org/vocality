import { Command } from '../interfaces/Command';
import { CommandOptions } from '../interfaces/CommandOptions';
import { Message } from 'discord.js';
import { ServerQueueController } from '../core/ServerQueueController';
import { onQueueChange } from '../dashboard-ws';

export class Move implements Command {
  options: CommandOptions = {
    id: {
      name: 'move',
      aliases: ['mv'],
    },
    displayName: 'move x(songindex) y(new songindex)',
    description: 'moves a Song forward or backward in the queue',
    socketEnabled: true,
    minArguments: 2,
  };
  execute(msg: Message, args: string[]): void {
    if (isNaN(+args[0]) || isNaN(+args[1])) {
      msg.reply('x or y have to be numbers e.g. `?move 1 2`');
      return;
    }
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;

    const songIndex = +args[0];
    const futureSongIndex = +args[1];
    console.log(serverEntry.songs[songIndex]);
    if (
      serverEntry.songs.length < songIndex ||
      serverEntry.songs.length < futureSongIndex
    ) {
      msg.reply(
        'the numbers have to be less than Songs in the Queue. Current Queue Size: ' +
          serverEntry.songs.length
      );
      return;
    }
    if (0 > songIndex || 0 > futureSongIndex) {
      msg.reply('x and y have to be bigger than zero');
      return;
    }
    const songs = serverEntry.songs;
    songs.splice(futureSongIndex, 0, songs.splice(songIndex, 1)[0]);
    onQueueChange(serverEntry);
    msg.channel.send(
      `Moved **${serverEntry.songs[futureSongIndex].title}** from position ${songIndex} to ${futureSongIndex}`
    );
  }
}
