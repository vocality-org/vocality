import { Command } from '../interfaces/Command';
import { Message, RichEmbed, MessageReaction } from 'discord.js';
import { Genius, Emoji, Bot } from '../config';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import queryString from 'query-string';
import { ServerQueueController } from '../core/ServerQueueController';

export class Lyrics implements Command {
    options = {
        name: 'lyrics',
        description: 'Display the lyrics',
        hasArguments: false,
        socketEnabled: false,
    };

    lyricsList: string[];
    pageChanges: number;

    constructor() {
        this.lyricsList = [];
        this.pageChanges = 0;
    }

    execute(msg: Message, args: string[]): void {
        if (ServerQueueController.getInstance().find(msg.guild.id) == undefined) return;
        const songs = ServerQueueController.getInstance().find(msg.guild.id)!.songs;

        if (songs.length === 0 && args.length === 0) msg.channel.send('No Song in Queue and no argument provided');
        else {
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
                        `No Lyrics found consider using \`\`${Bot.SERVERPREFIXES[msg.guild.id]}lyrics <searchstring>\`\``,
                    );
                    return;
                }
            } else {
                searchString.q = args.join(' ');
            }
            fetch(
                Genius.GENIUS_API_URI +
                    '/search?' +
                    queryString.stringify(searchString) +
                    '&access_token=' +
                    Genius.GENIUS_API_TOKEN,
                { headers: { 'content-type': 'application/json' }, method: 'GET' },
            ).then(async response => {
                const data = await response.json();
                if (data.response.hits.length === 0)
                    return msg.channel.send(
                        `No Lyrics found consider using \`\`${Bot.SERVERPREFIXES[msg.guild.id]}lyrics <searchstring>\`\``,
                    );
                var WebsiteData = await fetch(data.response.hits[0].result.url);
                var website = await WebsiteData.text();
                const $ = cheerio.load(website as any);
                const lyrics = $('.lyrics').text();

                this.lyricsList = lyrics.match(/[\s\S]{1,2048}/g) as string[];
                const embed = new RichEmbed()
                    .setTitle(`Lyrics for ${args.length !== 0 ? data.response.hits[0].result.full_title : songs[0].title}`)
                    .setURL(data.response.hits[0].result.url)
                    .setDescription(this.lyricsList[0])
                    .setColor('#00e773')
                    .setFooter(`Page 1 of ${this.lyricsList.length}`);
                msg.channel.send(
                    `${Emoji.WARNING}if this is not the right lyrics consider \`\`${
                        Bot.SERVERPREFIXES[msg.guild.id]
                    }lyrics <searchstring>\`\``,
                );
                msg.channel
                    .send(embed)
                    .then(msg => this.handleReactions(msg as Message, args.length !== 0 ? 60000 : songs[0].length_ms));
            });
        }
    }

    /**
     * Adds reactions to the message to allow for page control.
     * Listens for user reactions to change pages.
     *
     * @private
     * @param {Message} message
     * @param {number} songDuration
     * @memberof Lyrics
     */
    private async handleReactions(message: Message, songDuration: number) {
        // Add inital reactions
        await message.react(Emoji.ARROW_BACKWARD);
        await message.react(Emoji.ARROW_FORWARD);

        const filter = (reaction: MessageReaction, user: any) => {
            return message.author.id !== user.id && [Emoji.ARROW_BACKWARD, Emoji.ARROW_FORWARD].includes(reaction.emoji.name);
        };

        const collector = message.createReactionCollector(filter, {
            time: songDuration,
        });

        collector.on('collect', (reaction, collector) => {
            const embed = new RichEmbed({
                title: message.embeds[0].title,
                url: message.embeds[0].url,
                color: message.embeds[0].color,
            });
            if (reaction.emoji.name === Emoji.ARROW_BACKWARD) {
                this.pageChanges--;
                embed.setDescription(this.lyricsList[this.getPageIndex()]);
                embed.setFooter(`Page ${1 + this.getPageIndex()} of ${this.lyricsList.length}`);
            } else {
                this.pageChanges++;
                embed.setDescription(this.lyricsList[this.getPageIndex()]);
                embed.setFooter(`Page ${1 + this.getPageIndex()} of ${this.lyricsList.length}`);
            }
            message.edit(embed);
            reaction.remove(reaction.users.lastKey());
        });

        collector.on('end', collected => {
            collected.forEach(r => r.remove());
        });
    }

    /**
     * Returns the zero based `lyricsList` index based on the current pageChange.
     * Allows for the pages to circle.
     *
     * @private
     * @returns {number}
     * @memberof Lyrics
     */
    private getPageIndex(): number {
        return ((this.pageChanges % this.lyricsList.length) + this.lyricsList.length) % this.lyricsList.length;
    }
}
