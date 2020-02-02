import { Command, CommandOptions } from '@vocality-org/types';

import { Message, MessageEmbed } from 'discord.js';
import { FileOperations } from '../../utils/FileOperations';
import { Vote } from '../../types/Vote';
import { ReactionHandler, COLOR } from '@vocality-org/core';

export class List implements Command {
  options: CommandOptions = {
    id: {
      name: 'list',
    },
    description: 'Shows a list of all archived Polls for this guild',
    usage: '?archived list',
    minArguments: 0,
  };

  async execute(msg: Message, args: string[]) {
    const data = FileOperations.readFromFile();
    if (data) {
      const guildMap: Map<string, Vote[]> = new Map(JSON.parse(data));
      const guildArray = guildMap.get(msg.guild!.id);
      const archived: string[] = [];
      const pages = Math.ceil(guildArray!.length / 10);
      for (let i = 1; i <= pages; i++) {
        const list: string[] = [];
        for (
          let j = (i - 1) * 10;
          j <= (guildArray!.length < i * 10 ? guildArray!.length - 1 : i * 10);
          j++
        ) {
          list.push(
            `**${j + 1}.Entry** [${
              guildArray![j].id
            }]        initiated by        *${
              msg.guild!.members.get(guildArray![j].initiator)?.user.username
            }* with Question **${guildArray![j].question}**`
          );
        }
        archived.push(list.join('\n\n'));
        const richEmbed = new MessageEmbed()
          .setTitle('Archived Polls')
          .setDescription(archived)
          .setColor(COLOR.CYAN);

        const message = (await msg.channel.send({
          embed: richEmbed,
        })) as Message;
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
              description: archived[index],
            });
            embed.setFooter(`Page ${1 + index} of ${pages}`);

            message.edit(embed);
            reaction.users.remove(reaction.users.lastKey());
          }
        );
      }
    } else {
      msg.channel.send('No archived Polls to show');
    }
  }
}
