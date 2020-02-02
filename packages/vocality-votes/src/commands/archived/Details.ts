import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { FileOperations } from '../../utils/FileOperations';
import { Vote } from '../../types/Vote';
import { buildStatsMessage } from '../../utils/buildStatsMessage';

export class Details implements Command {
  options: CommandOptions = {
    id: {
      name: 'details',
    },
    description: 'Shows the detailed outcome of a Poll',
    usage: '?archived details <id of Poll>',
    minArguments: 1,
  };

  async execute(msg: Message, args: string[]) {
    const data = FileOperations.readFromFile();
    if (data) {
      const guildMap: Map<string, Vote[]> = new Map(JSON.parse(data));
      const archivedPoll = guildMap
        .get(msg.guild!.id)
        ?.find(v => v.id === args[0]);
      if (archivedPoll) {
        buildStatsMessage(archivedPoll, msg);
      } else {
        msg.channel.send('Poll does not exist');
      }
    } else {
      msg.channel.send('No archived Polls to show');
    }
  }
}
