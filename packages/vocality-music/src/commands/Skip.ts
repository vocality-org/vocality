import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Skip implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'skip',
      aliases: ['next'],
    },
    displayName: 'skip (<optional amount of songs to skip>)',
    description: 'Skip the current song',
    minArguments: 0,
    socketEnabled: true,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild.id, msg);
  }

  run(args: string[], guildId: string, msg?: Message) {
    const serverEntry = ServerQueueController.getInstance().find(guildId)!;

    if (!msg?.member.voiceChannel) {
      msg?.channel.send('You have to be in a voice channel to skip!');
    } else if (!serverEntry) {
      msg.channel.send('There is no song that I could skip!');
    } else if (args[0]) {
      if (Number(args[0])) {
        const songsToSkip: number = Number.parseInt(args[0], 10);
        if (songsToSkip > serverEntry.songs.length) {
          msg.channel.send('The number is too big');
        } else {
          serverEntry.songs.splice(
            serverEntry.currentlyPlaying,
            songsToSkip - 1
          );
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
