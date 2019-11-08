import { Command } from '../interfaces/Command';
import { Message } from 'discord.js';
import { ServerQueueController } from '../core/ServerQueueController';

export class Remove implements Command {
  options = {
    name: 'remove <id of song>',
    description: 'Remove an item from the queue starting at 1',
    minArguments: 1,
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
    if (!msg.member.voiceChannel) {
      msg.channel.send('You have to be in a voice channel to stop the music!');
    } else if (!serverEntry) {
      msg.channel.send('There is no song that I could remove!');
    } else if (args[0]) {
      if (Number(args[0])) {
        const idToRemove: number = Number.parseInt(args[0], 10);
        if (idToRemove > serverEntry.songs.length) {
          msg.channel.send('The number is too big');
        } else {
          serverEntry.songs.splice(idToRemove - 1, 1);
          if (idToRemove === 1) {
            serverEntry.connection!.dispatcher.end();
          }
        }
      } else {
        msg.channel.send('The Argument is not a number');
      }
    }
  }
}
