import { Message, RichEmbed } from 'discord.js';
import { Vote } from '../types/Vote';
import { format } from 'date-fns';
import { ReactionHandler } from '@vocality-org/core';
import { DEFAULT_REACTIONS } from '../config';

export class VotingUtils {
  static async displayMessage(msg: Message, serverQueue: Vote) {
    const guild = msg.guild;
    const maxVotes =
      serverQueue.allowedToVote[0] === '0' ||
      serverQueue.allowedToVote[0] === '1'
        ? guild.members.filter(m => !m.user.bot).size
        : guild.members.filter(m =>
            m.roles.some(r => serverQueue.allowedToVote.includes(r.name))
          ).size;
    const votingString = this.buildVotingString(serverQueue, maxVotes);
    const votingEmbed = new RichEmbed()
      .setTitle(serverQueue.question)
      .setDescription(votingString)
      .addBlankField()
      .addField(
        'Deadline',
        serverQueue.deadline
          ? format(serverQueue.deadline, 'dd.MM.yyyy HH:mm')
          : 'Custom',
        true
      )
      .addField('Anonymous', serverQueue.anonymous, true)
      .addField('Initiator', msg.author.username, true);

    const message = (await msg.channel.send({ embed: votingEmbed })) as Message;
    message.pin();
    const rHandler = new ReactionHandler();
    serverQueue.votes.forEach((v, index) => {
      if (this.checkForEmoji(v.id)) {
        rHandler.addReaction(message, v.id);
      } else {
        rHandler.addReaction(message, DEFAULT_REACTIONS[index]);
      }
    });
  }
  static checkForEmoji(emoji: string) {
    return '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])'.includes(
      emoji
    );
  }
  static buildVotingString(serverQueue: Vote, maxVotes: number) {
    const voted = serverQueue.votes.reduce((a, b) => a + b.votes, 0);
    let votingString = `There voted **${voted}** out of **${maxVotes}** people \n \n`;
    for (const option of serverQueue.votes) {
      votingString += `${
        this.checkForEmoji(option.id)
          ? option.id
          : DEFAULT_REACTIONS[
              serverQueue.votes.findIndex(v => v.id === option.id)
            ] +
            ' ' +
            option.id
      } \t ▬▬▬▬▬▬▬▬ (${option.votes}/${maxVotes}) \n`;
    }
    return votingString;
  }
}
