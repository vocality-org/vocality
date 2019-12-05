import { Command } from '../interfaces/Command';
import { CommandOptions } from '../interfaces/CommandOptions';
import { Message, RichEmbed, MessageEmbedField } from 'discord.js';
import { ServerQueueController } from '../core/ServerQueueController';
import { ReactionHandler } from '../core/handlers/ReactionHandler';

export class Queue implements Command {
  options: CommandOptions = {
    id: {
      name: 'queue',
      aliases: ['qu'],
    },
    displayName: 'queue <optional amount of songs>',
    description: 'displays the current Song Queue',
    minArguments: 0,
    socketEnabled: false,
  };
  subCommands?: Command[] | undefined;
  execute(msg: Message, args: string[]): void {
    const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    if (serverEntry.songs.length === 0) msg.channel.send('The Queue is empty');
    else {
      const songList: string[] = [];
      const pages = Math.ceil(serverEntry.songs.length / 10);
      console.log(serverEntry.songs.length);
      for (let i = 1; i <= pages; i++) {
        const list: string[] = [];
        for (
          let j = (i - 1) * 10;
          j <
          (serverEntry.songs.length < i * 10
            ? serverEntry.songs.length - 1
            : i * 10);
          j++
        ) {
          console.log(j);
          list.push(
            `**${j + 1}.Entry** [${serverEntry.songs[j + 1].title}](${
              serverEntry.songs[j + 1].url
            }) | length: \`${
              serverEntry.songs[j + 1].length
            }\` | requested by: \`${serverEntry.songs[j + 1].requested_by}\``
          );
        }
        songList.push(list.join('\n\n'));
      }
      console.log(songList);
      const nowPlaying: { name: string; value: string } = {
        name: 'Now Playing',
        value: `[${serverEntry.songs[0].title}](${serverEntry.songs[0].url}) | length: \`${serverEntry.songs[0].length}\` | requested by: \`${serverEntry.songs[0].requested_by}\``,
      };
      const queue = new RichEmbed()
        .setTitle('Current Song Queue')
        .addField(nowPlaying.name, nowPlaying.value)
        .setDescription(songList[0])
        .setColor('#00e773')
        .setFooter(`Page 1 of ${songList.length}`);

      msg.channel.send(queue).then(msg => {
        const rHandler = new ReactionHandler();
        rHandler.handleReactions(
          msg as Message,
          100000,
          songList,
          nowPlaying as MessageEmbedField
        );
      });
    }
  }
}
