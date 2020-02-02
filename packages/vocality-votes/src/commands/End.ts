import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';
import { handleDelete } from '../utils/handleDelete';

export class End implements Command {
  options: CommandOptions = {
    id: {
      name: 'end',
    },
    description: 'End a Poll',
    usage: 'end <id or username>',
    minArguments: 1,
  };
  async execute(msg: Message, args: string[]) {
    const serverQueues = ServerQueueController.getInstance().find(
      msg.guild!.id
    );
    const polls = serverQueues?.filter(v =>
      msg.guild!.members.get(v.initiator)?.user.username === args[0]
        ? true
        : false
    );
    if (polls === undefined || polls!.length === 0) {
      const poll = serverQueues!.find(v => v.id === args[0]);
      if (!poll) {
        msg.channel.send(
          'Your username or the Id you provided are not correct'
        );
        return;
      } else {
        if (poll.initiator === msg.author.id) {
          handleDelete(poll, msg);
        } else {
          msg.reply('You are not the Initiator of the Poll!');
        }
      }
    } else {
      if (polls.length > 1) {
        msg.channel.send(
          'There are more than one Polls active please provide a unique Identifier (you can find the unique Id in the Footer of the Poll)'
        );
        return;
      } else {
        if (polls[0].initiator === msg.author.id) {
          handleDelete(polls[0], msg);
        } else {
          msg.reply('You are not the Initiator of the Poll!');
        }
      }
    }
  }
}
