import { COLOR } from '@vocality-org/core';
import { Command, CommandOptions } from '@vocality-org/types';
import { Message, MessageEmbed } from 'discord.js';
import lowdb from 'lowdb';
import { adapter } from '../warning-adapter';

export class Incidents implements Command {
  options: CommandOptions = {
    id: {
      name: 'ban',
    },
    description: 'List all warnings for a user',
    usage: 'incidents [@user]',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
      async () => {
        const mId = msg.mentions.members?.first()?.id;

        const warnings: string[] = (await lowdb(adapter))
          .get(`${msg.guild?.id}.${mId}`, [])
          .value();

        const embed = new MessageEmbed().setColor(COLOR.CYAN);

        embed.setTitle(
          `${msg.mentions.members?.first()?.displayName} has ${
            warnings.length
          } warnings`
        );

        embed.setDescription(warnings.map((w, i) => `${i++} ${w}`).join('\n'));

        msg.channel.send(embed);
      };
    }
  }
}
