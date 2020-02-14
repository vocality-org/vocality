import { COLOR } from '@vocality-org/core';
import { Command, CommandOptions } from '@vocality-org/types';
import { Message, MessageEmbed } from 'discord.js';
import lowdb from 'lowdb';
import { adapter } from '../warning-adapter';

export class Ban implements Command {
  options: CommandOptions = {
    id: {
      name: 'warn',
    },
    description: 'Warn a user',
    usage: 'warn [@user] (message)',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    if (msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
      async () => {
        const mId = msg.mentions.members?.first()?.id;

        const warnings = (await lowdb(adapter))
          .get(`${msg.guild?.id}.${mId}`, [])
          .value();

        (await lowdb(adapter))
          .set(`${msg.guild?.id}.${mId}`, [
            ...warnings,
            args[1] ? args[1] : 'no-message',
          ])
          .write();

        msg.mentions.members
          ?.first()
          ?.createDM()
          .then(dm => {
            const embed = new MessageEmbed().setColor(COLOR.GREY);

            embed.setTitle(`Warning ${warnings ? warnings.length : 1}!`);
            embed.setDescription(
              `A server moderator on ${
                msg.guild?.name
              } sent you a warning. This incident will be recorded.\n\nMessage:\n${
                args[1] ? args[1] : '/'
              }`
            );
            embed.setTimestamp(new Date());

            dm.send(embed);
          });
      };
    }
  }
}
