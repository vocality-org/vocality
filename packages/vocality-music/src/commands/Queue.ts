import { ReactionHandler } from '@vocality-org/core';
import { Message, MessageEmbed } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

export class Queue implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'queue',
      aliases: ['qu'],
    },
    usage: 'queue <optional amount of songs>',
    description: 'displays the current Song Queue',
    minArguments: 0,
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild!.id, msg);
  }

  run(args: string[], guildId: string, msg?: Message) {
    let serverEntry;

    if (msg) {
      serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(
        msg
      );
    } else {
      serverEntry = ServerQueueController.getInstance().findOrCreateFromGuildId(
        guildId
      );
    }

    if (serverEntry.songs.length === 0) msg?.channel.send('The Queue is empty');
    else {
      const songList: string[] = [];
      const pages = Math.ceil(serverEntry.songs.length / 10);
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

      const nowPlaying: { name: string; value: string } = {
        name: 'Now Playing',
        value: `[${serverEntry.songs[0].title}](${serverEntry.songs[0].url}) | length: \`${serverEntry.songs[0].length}\` | requested by: \`${serverEntry.songs[0].requested_by}\``,
      };

      const queue = new MessageEmbed()
        .setTitle('Current Song Queue')
        .addField(nowPlaying.name, nowPlaying.value)
        .setDescription(songList[0])
        .setColor('#00e773')
        .setFooter(`Page 1 of ${songList.length}`);

      msg?.channel.send({ embed: queue }).then(async msg => {
        const message = msg as Message;
        const rHandler = new ReactionHandler();

        rHandler.addPagination(message);

        rHandler.onReactionPagination(
          message,
          100000,
          songList.length,
          (reaction, index) => {
            const embed = new MessageEmbed({
              title: message.embeds[0].title,
              url: message.embeds[0].url,
              color: message.embeds[0].color,
              description: songList[index],
            });
            embed.setFooter(`Page ${1 + index} of ${songList.length}`);
            embed.addField(nowPlaying.name, nowPlaying.value);

            message.edit({ embed });
            reaction.users.remove(reaction.users.cache.lastKey());
          }
        );
      });
    }
  }
}
