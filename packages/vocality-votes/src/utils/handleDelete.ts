import { Vote } from '../types/Vote';
import { Message, RichEmbed } from 'discord.js';
import { ReactionHandler } from '@vocality-org/core';
import { Answer } from '../types/Answer';
import { getMaxVotes } from './getMaxVotes';

export const handleDelete = (serverQueue: Vote, msg: Message) => {
  if (serverQueue.initiator !== msg.author.id) {
    msg.channel.send('You are not authorized to stop the Poll');
    return;
  }
};
