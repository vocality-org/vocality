import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { handleDelete } from '../utils/handleDelete';

export class Wizard implements Command {
  options: CommandOptions = {
    id: {
      name: 'end',
    },
    description: 'End a Poll',
    usage: '?end <id>',
    minArguments: 1,
  };
  async execute(msg: Message, args: string[]) {
    const serverQueues = ServerQueueController.getInstance().find(msg.guild.id);
    let polls = serverQueues?.filter(
      v => msg.guild.members.get(v.initiator)?.user.username === args[0]
    );
    if (!polls) {
      let poll = serverQueues?.find(v => v.id === args[0]);
      if (!poll) {
        msg.channel.send(
          'Your username or the Id you provided are not correct'
        );
        return;
      } else {
        handleDelete(poll, msg);
      }
    }
    if (polls !== undefined) {
      if (polls.length > 1) {
        msg.channel.send(
          'There are more than one Polls active please provide a unique Identifier (you can find the unique Id in the Footer of the Poll)'
        );
        return;
      } else {
        handleDelete(polls[0], msg);
      }
    }
  }
}
