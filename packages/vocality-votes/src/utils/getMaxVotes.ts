import { Vote } from '../types/Vote';
import { Guild } from 'discord.js';

export const getMaxVotes = (serverQueue: Vote, guild: Guild) => {
  return serverQueue.allowedToVote[0] === '0' ||
    serverQueue.allowedToVote[0] === '1'
    ? guild.members.cache.filter(m => !m.user.bot).size
    : guild.members.cache.filter(m =>
        m.roles.cache.some(r => serverQueue.allowedToVote.includes(r.name))
      ).size;
};
