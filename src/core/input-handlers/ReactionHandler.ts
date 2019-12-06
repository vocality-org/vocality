import {
  Message,
  MessageReaction,
  User,
  RichEmbed,
  MessageEmbedField,
} from 'discord.js';

import { EMOJI } from '../../config';

export class ReactionHandler {
  private pageChanges: number;

  constructor() {
    this.pageChanges = 0;
  }

  /**
   * Helper function to add a reaction to the given message
   * Codes for discord emojis can be found the root config file
   */
  async addReaction(message: Message, emojiCode: string) {
    await message.react(emojiCode);
  }

  /**
   * Adds pagination arrows to the message
   */
  async addPagination(message: Message) {
    await message.react(EMOJI.ARROW_BACKWARD);
    await message.react(EMOJI.ARROW_FORWARD);
  }

  /**
   * Registers a generic reaction collector to the message
   * Invokes the callback with every collected reaction
   */
  onReactionAll(
    message: Message,
    duration: number,
    callback: (reaction: MessageReaction) => void
  ) {
    const filter = () => true;
    this.onReactionFiltered(message, duration, filter, callback);
  }

  /**
   * Registers a reaction collector to the message with a pagination specific filter
   * Invokes the callback on every reaction that passes the pagination filter.
   */
  onReactionPagination(
    message: Message,
    duration: number,
    listLength: number,
    callback: (reaction: MessageReaction, index: number) => void
  ) {
    const filter = (reaction: MessageReaction, user: User) => {
      return (
        message.author.id !== user.id &&
        [EMOJI.ARROW_BACKWARD, EMOJI.ARROW_FORWARD].includes(
          reaction.emoji.name
        )
      );
    };

    const paginationCallback = (reaction: MessageReaction) => {
      if (reaction.emoji.name === EMOJI.ARROW_BACKWARD) {
        this.pageChanges--;
      } else {
        this.pageChanges++;
      }

      callback(reaction, this.getPaginationIndex(listLength));
    };

    this.onReactionFiltered(message, duration, filter, paginationCallback);
  }

  /**
   * Registers a reaction collector to the message with the given filter
   */
  onReactionFiltered(
    message: Message,
    duration: number,
    filter: (reaction: MessageReaction, user: User) => boolean,
    callback: Function
  ) {
    const collector = message.createReactionCollector(filter, {
      time: duration,
    });

    collector.on('collect', (reaction, collector) => {
      callback(reaction);
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

  /**
   * Returns the zero based list index from the current pageChange.
   * Allows for the pages to circle.
   */
  private getPaginationIndex(listLength: number): number {
    return ((this.pageChanges % listLength) + listLength) % listLength;
  }
}
