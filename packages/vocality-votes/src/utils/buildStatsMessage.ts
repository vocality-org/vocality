import { Vote } from '../types/Vote';
import { Message, MessageEmbed } from 'discord.js';
import { Answer } from '../types/Answer';
import { ReactionHandler, COLOR } from '@vocality-org/core';

export const buildStatsMessage = async (serverQueue: Vote, msg: Message) => {
  const winner: Answer = serverQueue.votes.reduce((prev, curr) =>
    prev.votes < curr.votes ? curr : prev
  );
  if (
    serverQueue.votes.some((v, ind, arr) =>
      arr.some(v2 => v2.votes === v.votes)
    )
  ) {
    winner.id = 'draw';
  }
  const allVoters = serverQueue.votes
    .map(v =>
      v.users.map(u => {
        return { user: u, v: v.id };
      })
    )
    .reduce((acc, val) => acc.concat(val));
  const voters: string[] = [];
  const pages = Math.ceil(allVoters.length / 10);
  for (let i = 1; i <= pages; i++) {
    const list: string[] = [];
    for (
      let j = (i - 1) * 10;
      j <= (allVoters.length < i * 10 ? allVoters.length - 1 : i * 10);
      j++
    ) {
      list.push(
        `**${j + 1}.Entry** [${
          msg.guild!.members.cache.get(allVoters[j].user)?.user.username
        }]        voted for        *${
          serverQueue.anonymous ? 'anonymous' : allVoters[j].v
        }*`
      );
    }
    voters.push(list.join('\n\n'));
  }
  const voted = serverQueue.votes.reduce((a, b) => a + b.votes, 0);
  serverQueue.votingMessage?.unpin();
  serverQueue.votingMessage?.delete();
  const richEmbed = new MessageEmbed()
    .setTitle(`Results for vote ${serverQueue.id}`)
    .addBlankField()
    .addField('Question', serverQueue.question, true)
    .addField('Winner', winner.id, true)
    .addField('Votes', winner.votes, true)
    .addField('Participation', `${(voted * 100) / serverQueue.maxVotes}%`, true)
    .addField(
      'Initiator',
      msg.guild!.members.cache.get(serverQueue.initiator)?.user.username,
      true
    )
    .addField('Anonymous', serverQueue.anonymous, true)
    .setDescription(voters[0])
    .setFooter(`Page 1 of ${pages}`)
    .setColor(COLOR.CYAN);
  const message = (await msg.channel.send({ embed: richEmbed })) as Message;
  const rHandler = new ReactionHandler();
  rHandler.addPagination(message);
  rHandler.onReactionPagination(
    message,
    undefined,
    pages,
    (reaction, index) => {
      const embed = new MessageEmbed({
        title: message.embeds[0].title,
        url: message.embeds[0].url,
        color: message.embeds[0].color,
        fields: message.embeds[0].fields,
        description: voters[index],
      });
      embed.setFooter(`Page ${1 + index} of ${pages}`);

      message.edit(embed);
      reaction.users.remove(reaction.users.cache.lastKey());
    }
  );
};
