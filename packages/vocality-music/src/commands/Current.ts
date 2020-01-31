import { Message, RichEmbed } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { Song } from '../types/Song';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Current implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'current',
    },
    usage: 'current',
    description: 'Display the current song',
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild.id, msg);
  }

  run(args: string[], guildId: string, msg?: Message) {
    const serverEntry = ServerQueueController.getInstance().find(guildId)!;

    if (serverEntry.songs.length === 0) msg?.channel.send('No song is playing');
    else {
      const song: Song = serverEntry.songs[serverEntry.currentlyPlaying];
      const ss = serverEntry.connection!.dispatcher.time / 1000;

      const embed = new RichEmbed()
        .setAuthor(
          song.author.name,
          song.author.avatarURL,
          song.author.channelUrl
        )
        .setTitle('Currently Playing')
        .setURL(song.url)
        .setColor('#00e773')
        .setDescription(song.title)
        .setImage(song.thumbnail_url)
        .addField(
          'Time',
          `${new Date(ss * 1000).toISOString().substr(11, 8)}/${song.length}`
        );

      msg?.channel.send({ embed });
    }
  }
}
