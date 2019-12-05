import {
  Message,
  MessageReaction,
  User,
  RichEmbed,
  MessageEmbedField,
} from 'discord.js';

import { EMOJI } from '../../config';

export class ReactionHandler {
  pageChanges: number;

  constructor() {
    this.pageChanges = 0;
  }
  /**
   * Adds reactions to the message to allow for page control.
   * Listens for user reactions to change pages.
   *
   * @private
   * @param {Message} message
   * @param {number} songDuration
   * @param {string[]} list
   * @memberof Lyrics
   */
  async handleReactions(
    message: Message,
    songDuration: number,
    lyricsList: string[],
    nowPlayingInformation?: MessageEmbedField | undefined
  ) {
    // Add inital reactions
    await message.react(EMOJI.ARROW_BACKWARD);
    await message.react(EMOJI.ARROW_FORWARD);

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        message.author.id !== user.id &&
        [EMOJI.ARROW_BACKWARD, EMOJI.ARROW_FORWARD].includes(
          reaction.emoji.name
        )
      );
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
      if (reaction.emoji.name === EMOJI.ARROW_BACKWARD) {
        this.pageChanges--;
        embed.setDescription(lyricsList[this.getPageIndex(lyricsList)]);
        embed.setFooter(
          `Page ${1 + this.getPageIndex(lyricsList)} of ${lyricsList.length}`
        );
      } else {
        this.pageChanges++;
        embed.setDescription(lyricsList[this.getPageIndex(lyricsList)]);
        embed.setFooter(
          `Page ${1 + this.getPageIndex(lyricsList)} of ${lyricsList.length}`
        );
      }
      if (nowPlayingInformation) {
        embed.addField(nowPlayingInformation.name, nowPlayingInformation.value);
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
  private getPageIndex(lyricsList: string[]): number {
    return (
      ((this.pageChanges % lyricsList.length) + lyricsList.length) %
      lyricsList.length
    );
  }
}
