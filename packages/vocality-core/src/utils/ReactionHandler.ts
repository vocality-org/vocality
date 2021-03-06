import { Message, MessageReaction, User } from 'discord.js';

import { EMOJI } from '../config';

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
    duration: number | undefined,
    callback: (reaction: MessageReaction, additionalData?: any) => void,
    additionalData?: any
  ) {
    const filter = () => true;
    this.onReactionFiltered(
      message,
      duration,
      filter,
      callback,
      additionalData
    );
  }

  /**
   * Registers a reaction collector to the message with a pagination specific filter
   * Invokes the callback on every reaction that passes the pagination filter.
   */
  onReactionPagination(
    message: Message,
    duration: number | undefined,
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
    duration: number | undefined,
    filter: (
      reaction: MessageReaction,
      user: User,
      additionalData?: any
    ) => boolean,
    callback: Function,
    additionalData?: any
  ) {
    const collector = message.createReactionCollector(
      (reaction, user) => filter(reaction, user, additionalData),
      {
        time: duration,
      }
    );

    collector.on('collect', (reaction, cl) => {
      callback(reaction, additionalData);
    });

    collector.on('end', collected => {
      collected.forEach(r => r.remove());
    });
  }

  /**
   * Returns the zero based list index from the current pageChange.
   */
  private getPaginationIndex(listLength: number): number {
    return ((this.pageChanges % listLength) + listLength) % listLength;
  }
}
