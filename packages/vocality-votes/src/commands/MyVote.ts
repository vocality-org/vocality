import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';

export class MyVote implements Command {
  options: CommandOptions = {
    id: {
      name: 'myvote',
    },
    description: 'shows you the vote for your last or any specific active poll',
    usage: '?myvote <optional unique Id from Poll>',
    minArguments: 0,
  };
  execute(msg: Message, args: string[]) {
    const serverQueues = ServerQueueController.getInstance().find(
      msg.guild!.id
    );
    let myVote;
    console.log(args.length);
    if (args.length === 0) {
      myVote = serverQueues
        ?.filter(v => {
          if (v.votes.some(vote => vote.users.includes(msg.author.id))) {
            return true;
          } else {
            return false;
          }
        })
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
    } else {
      myVote = serverQueues!.find(v => v.id === args[0]);
    }
    if (!myVote) {
      msg.author.send("You didn't vote for anything");
    } else {
      msg.author.send(
        `You voted for the message *${myVote!.id}* with the Question **${
          myVote?.question
        }** --> ${myVote?.votes.find(v => v.users.includes(msg.author.id))?.id}`
      );
    }
  }
}
