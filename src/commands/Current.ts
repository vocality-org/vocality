import { Command } from '../interfaces/Command';
import { QueueContract } from '../interfaces/QueueContract';
import { Message, RichEmbed } from 'discord.js';
import { Song } from '../interfaces/Song';
import { ServerQueueController } from '../core/ServerQueueController';

export class Current implements Command {
  options = {
    name: 'current',
    description: 'Display the current song',
    hasArguments: false,
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
    if (serverEntry.songs.length === 0) msg.channel.send('No song is playing');
    else {
      const song: Song = serverEntry.songs[0];
      const ss = serverEntry.connection!.dispatcher.time / 1000;

      console.log(song.thumbnail_url);
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
