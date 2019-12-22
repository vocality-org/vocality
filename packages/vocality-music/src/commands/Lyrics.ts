import { Message, RichEmbed } from 'discord.js';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import queryString from 'query-string';
import { ServerQueueController } from '../controller/ServerQueueController';
import { Command, CommandOptions } from '../../../vocality-types/build/src';
import { BOT, EMOJI, ReactionHandler } from '@vocality-org/core';
import { GENIUS } from '../config';

export class Lyrics implements Command {
  options: CommandOptions = {
    id: {
      name: 'lyrics',
    },
    displayName: 'lyrics (<optional searchstring>)',
    description: 'Display the lyrics',
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    if (ServerQueueController.getInstance().find(msg.guild.id) === undefined) {
      return;
    }

    const songs = ServerQueueController.getInstance().find(msg.guild.id)!.songs;

    if (songs.length === 0 && args.length === 0) {
      msg.channel.send('No Song in Queue and no argument provided');
    } else {
      const searchString = { q: '' };

      if (args.length === 0) {
        const song = songs[0];
        if (song.interpreters && song.songName) {
          searchString.q = `${song.songName} by ${song.interpreters}`;
        } else if (song.interpreters && !song.songName) {
          searchString.q = `${song.interpreters}`;
        } else if (!song.interpreters && song.songName) {
          searchString.q = `${song.songName}`;
        } else if (!song.interpreters && !song.songName) {
          msg.channel.send(
            `No Lyrics found consider using \`\`${
              BOT.SERVERPREFIXES[msg.guild.id]
            }lyrics <searchstring>\`\``
          );
          return;
        }
      } else {
        searchString.q = args.join(' ');
      }

      fetch(
        GENIUS.GENIUS_API_URI +
          '/search?' +
          queryString.stringify(searchString) +
          '&access_token=' +
          process.env.GENIUS_API_TOKEN,
        {
          headers: { 'content-type': 'application/json' },
          method: 'GET',
        }
      ).then(async response => {
        const data = await response.json();

        if (data.response.hits.length === 0) {
          msg.channel.send(
            `No Lyrics found consider using \`\`${
              BOT.SERVERPREFIXES[msg.guild.id]
            }lyrics <searchstring>\`\``
          );
          return;
        }
        const websiteData = await fetch(data.response.hits[0].result.url);
        const website = await websiteData.text();
        const $ = cheerio.load(website);
        const lyrics = $('.lyrics').text();
        const lyricsList = lyrics.match(/[\s\S]{1,2048}/g) as string[];

        const embed = new RichEmbed()
          .setTitle(
            `Lyrics for ${
              args.length !== 0
                ? data.response.hits[0].result.full_title
                : songs[0].title
            }`
          )
          .setURL(data.response.hits[0].result.url)
          .setDescription(lyricsList[0])
          .setColor('#00e773')
          .setFooter(`Page 1 of ${lyricsList.length}`);

        msg.channel.send(
          `${EMOJI.WARNING}if this is not the right lyrics consider \`\`${
            BOT.SERVERPREFIXES[msg.guild.id]
          }lyrics <searchstring>\`\``
        );

        msg.channel.send(embed).then(async msg => {
          const message = msg as Message;
          const duration = args.length !== 0 ? 60000 : songs[0].length_ms;

          const rHandler = new ReactionHandler();

          await rHandler.addPagination(message);

          rHandler.onReactionPagination(
            message,
            duration,
            lyricsList.length,
            (reaction, index) => {
              const embed = new RichEmbed({
                title: message.embeds[0].title,
                url: message.embeds[0].url,
                color: message.embeds[0].color,
                description: lyricsList[index],
              });
              embed.setFooter(`Page ${1 + index} of ${lyricsList.length}`);

              message.edit(embed);
              reaction.remove(reaction.users.lastKey());
            }
          );
        });
      });
    }
  }
}
