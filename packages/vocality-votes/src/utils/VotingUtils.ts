import { Message, RichEmbed, User, MessageReaction } from 'discord.js';
import { Vote } from '../types/Vote';
import { ReactionHandler } from '@vocality-org/core';
import { DEFAULT_REACTIONS, BLUECIRCLE } from '../config';
import { getMaxVotes } from './getMaxVotes';
import { Answer } from '../types/Answer';

export class VotingUtils {
  static async displayMessage(msg: Message, serverQueue: Vote, edit: boolean) {
    const guild = msg.guild;
    serverQueue.maxVotes = getMaxVotes(serverQueue, guild);

    const votingString = this.buildVotingString(
      serverQueue,
      serverQueue.maxVotes
    );
    const votingEmbed = new RichEmbed()
      .setTitle(serverQueue.question)
      .setDescription(votingString)
      .addBlankField()
      .addField('Stop Voting', 'Write ?end with the ID from the Footer', true)
      .addField('Anonymous', serverQueue.anonymous, true)
      .addField('Initiator', serverQueue.initMessage.author.username, true)
      .setFooter(serverQueue.id);

    const message = edit
      ? ((await msg.edit({ embed: votingEmbed })) as Message)
      : ((await msg.channel.send({ embed: votingEmbed })) as Message);
    !message.pinned ? await message.pin() : undefined;

    serverQueue.votingMessage = message;
    const rHandler = new ReactionHandler();
    for (let i = 0; i < serverQueue.votes.length; i++) {
      const v = serverQueue.votes[i];
      if (this.checkForEmoji(v.id)) {
        await rHandler.addReaction(message, v.id);
      } else {
        await rHandler.addReaction(message, DEFAULT_REACTIONS[i]);
      }
    }
    if (!edit) {
      rHandler.onReactionFiltered(
        message,
        undefined,
        this.filterReactions,
        this.onReaction,
        serverQueue
      );
    }
  }
  static checkForEmoji(emoji: string) {
    return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/.test(
      emoji
    );
  }
  static filterReactions(
    reaction: MessageReaction,
    user: User,
    additionalData: any
  ) {
    if (user.id === reaction.message.author.id) {
      return false;
    }
    const serverQueue = additionalData as Vote;
    if (
      !serverQueue.allowedToVote.some(a =>
        reaction.message.guild.roles.get(a)?.members.find('user', user)
      ) &&
      !serverQueue.allowedToVote.some(a => a === '0')
    ) {
      reaction.message.channel.send('Your vote will not count ' + user);
      return false;
    }
    if (serverQueue.votes.every(v => VotingUtils.checkForEmoji(v.id))) {
      return serverQueue.votes.some(v => v.id === reaction.emoji.name);
    } else {
      return DEFAULT_REACTIONS.some(dr => dr === reaction.emoji.name);
    }
  }
  static hasAlreadyVoted(user: User, serverQueue: Vote, name: string) {
    return serverQueue.votes.some(
      v => v.users.includes(user.id) && v.id !== name
    );
  }
  static onReaction(reaction: MessageReaction, additionalData: any) {
    const serverQueue = additionalData as Vote;
    let answer: Answer;
    if (serverQueue.votes.every(v => VotingUtils.checkForEmoji(v.id))) {
      answer = serverQueue.votes.find(v => v.id === reaction.emoji.name)!;
    } else {
      let index = 0;
      index = DEFAULT_REACTIONS.findIndex(dr => dr === reaction.emoji.name);
      answer = serverQueue.votes[index];
    }
    console.log(answer);
    if (serverQueue.anonymous) {
      if (
        VotingUtils.hasAlreadyVoted(
          reaction.users.last(),
          serverQueue,
          reaction.emoji.name
        )
      ) {
        reaction.message.channel.send(
          'You cannot vote twice ' + reaction.users.last()
        );
      } else if (answer?.users.includes(reaction.users.last().id)) {
        answer!.users.push(reaction.users.last().id);
      } else {
        answer!.votes++;
        answer!.users.push(reaction.users.last().id);
        VotingUtils.displayMessage(reaction.message, serverQueue, true);
      }
      reaction.remove(reaction.users.last());
    } else {
      if (
        VotingUtils.hasAlreadyVoted(
          reaction.users.last(),
          serverQueue,
          reaction.emoji.name
        )
      ) {
        reaction.message.channel.send(
          'You cannot vote twice ' + reaction.users.last()
        );
        reaction.remove(reaction.users.last());
      } else {
        answer!.votes++;
        answer!.users.push(reaction.users.last().id);
        VotingUtils.displayMessage(reaction.message, serverQueue, true);
      }
    }
  }
  static buildVotingString(serverQueue: Vote, maxVotes: number) {
    const voted = serverQueue.votes.reduce((a, b) => a + b.votes, 0);
    let votingString = `There voted **${voted}** out of **${maxVotes}** people \n \n`;
    for (const option of serverQueue.votes) {
      let voteVisualized = BLUECIRCLE + '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
      const removedVotes = voteVisualized.substr(
        voteVisualized.length -
          option.votes * Math.round(maxVotes / voteVisualized.length)
      );
      voteVisualized =
        removedVotes +
        voteVisualized.substr(0, voteVisualized.length - removedVotes.length);
      votingString += `${
        this.checkForEmoji(option.id)
          ? option.id
          : DEFAULT_REACTIONS[
              serverQueue.votes.findIndex(v => v.id === option.id)
            ] +
            ' ' +
            option.id
      } \n ${voteVisualized} \n (${option.votes}/${maxVotes}) \n \n`;
    }
    return votingString;
  }
}
