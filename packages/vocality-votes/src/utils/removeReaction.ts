import { MessageReaction, User } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { VotingUtils } from './VotingUtils';
import { BOT } from '@vocality-org/core';
import { DEFAULT_REACTIONS } from '../config';
import { Answer } from '../types/Answer';

export const removeReaction = (reaction: MessageReaction, user: User) => {
  const serverQueues = ServerQueueController.getInstance().findOrCreateFromGuildId(
    reaction.message.guild.id
  );
  const serverQueue = serverQueues?.find(
    v => v.id === reaction.message.embeds[0].footer.text
  )!;
  if (!serverQueue) return;
  let v: Answer;
  if (serverQueue.votes.every(v => VotingUtils.checkForEmoji(v.id))) {
    v = serverQueue.votes.find(v => v.id === reaction.emoji.name)!;
  } else {
    let index = 0;
    index = DEFAULT_REACTIONS.findIndex(dr => dr === reaction.emoji.name);
    v = serverQueue.votes[index];
  }
  if (!VotingUtils.filterReactions(reaction, user, serverQueue)) return;
  if (serverQueue?.anonymous) {
    if (
      serverQueue?.votes
        .find(v => v.id === reaction.emoji.name)!
        .users.filter(u => u === user.id).length === 1
    ) {
      return;
    } else {
      if (v!.votes !== 0) v!.votes--;
      v!.users
        .filter(u => u.includes(user.id))
        .forEach(u => {
          v!.users.splice(
            v!.users.findIndex(x => u === x),
            1
          );
        });
    }
  } else {
    if (BOT.NAME === user.username) return;
    if (v!.votes !== 0) v!.votes--;
    v!.users.splice(
      v!.users.findIndex(u => u === user.id),
      1
    );
  }

  VotingUtils.displayMessage(reaction.message, serverQueue!, true);
};
