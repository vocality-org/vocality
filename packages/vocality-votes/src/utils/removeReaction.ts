import { MessageReaction, User } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { VotingUtils } from './VotingUtils';
import { BOT } from '@vocality-org/core';

export const removeReaction = (reaction: MessageReaction, user: User) => {
  console.log(BOT.NAME);
  console.log(user.username);

  const serverQueues = ServerQueueController.getInstance().findOrCreateFromGuildId(
    reaction.message.guild.id
  );
  const serverQueue = serverQueues?.find(
    v => v.id === reaction.message.embeds[0].footer.text
  );
  if (!VotingUtils.filterReactions(reaction, user, serverQueue)) return;
  if (serverQueue?.anonymous) {
    if (
      serverQueue?.votes
        .find(v => v.id === reaction.emoji.name)!
        .users.filter(u => u === user.id).length === 1
    ) {
      return;
    } else {
      const v = serverQueue!.votes.find(v => v.id === reaction.emoji.name);
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
    const v = serverQueue!.votes.find(v => v.id === reaction.emoji.name);
    if (v!.votes !== 0) v!.votes--;
    v!.users.splice(
      v!.users.findIndex(u => u === user.id),
      1
    );
  }

  VotingUtils.displayMessage(reaction.message, serverQueue!, true);
};
