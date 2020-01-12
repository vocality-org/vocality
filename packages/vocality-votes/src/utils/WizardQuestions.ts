import { RichEmbed } from 'discord.js';
import { COLOR } from '@vocality-org/core';

export const getQuestion = (index: number) => {
  switch (index) {
    case 0:
      return new RichEmbed()
        .setColor(COLOR.CYAN)
        .setTitle('Whats your question?')
        .setDescription('Try to be as explanatory as possible in one Sentence')
        .setTimestamp(new Date())
        .setFooter('You have 5 Minutes to continue');
    case 1:
      return new RichEmbed()
        .setColor(COLOR.CYAN)
        .setTitle('Whats your question?')
        .setDescription('Try to be as explanatory as possible in one Sentence')
        .setTimestamp(new Date())
        .setFooter('You have 5 Minutes to continue');
    case 2:
      return new RichEmbed()
        .setColor(COLOR.CYAN)
        .setTitle('Whats your question?')
        .setDescription('Try to be as explanatory as possible in one Sentence')
        .setTimestamp(new Date())
        .setFooter('You have 5 Minutes to continue');
    case 3:
      return new RichEmbed()
        .setColor(COLOR.CYAN)
        .setTitle('Whats your question?')
        .setDescription('Try to be as explanatory as possible in one Sentence')
        .setTimestamp(new Date())
        .setFooter('You have 5 Minutes to continue');

    default:
      return new RichEmbed()
        .setColor(COLOR.CYAN)
        .setTitle('Whats your question?')
        .setDescription('Try to be as explanatory as possible in one Sentence')
        .setTimestamp(new Date())
        .setFooter('You have 5 Minutes to continue');
  }
};
