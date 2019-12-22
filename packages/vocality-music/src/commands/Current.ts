import { Message, RichEmbed } from 'discord.js';
import { Song } from '../interfaces/Song';
import { ServerQueueController } from '../controller/ServerQueueController';
import { Command, CommandOptions } from '../../../vocality-types/build/src';

export class Current implements Command {
  options: CommandOptions = {
    id: {
      name: 'current',
    },
    displayName: 'current',
    description: 'Display the current song',
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
    if (serverEntry.songs.length === 0) msg.channel.send('No song is playing');
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

      msg.channel.send(embed);
    }
  }
}
