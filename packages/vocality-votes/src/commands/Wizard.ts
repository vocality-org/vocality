import { Command, CommandOptions } from '@vocality-org/types';
import { Message, MessageCollector, DMChannel, TextChannel } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';

import { getQuestion } from '../utils/WizardQuestions';
import { Vote } from '../types/Vote';

export class Wizard implements Command {
  options: CommandOptions = {
    id: {
      name: 'wizard',
    },
    description: 'Start a wizard for your poll',
    minArguments: 0,
  };

  async execute(msg: Message, args: string[]) {
    const serverQueue = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    while (serverQueue.currentStep < serverQueue.maxSteps) {
      const embed = getQuestion(serverQueue.currentStep);
      const message = await msg.author.send({ embed });
      const m = message as Message;
      const collector = m.channel.createMessageCollector(m => m.content, {
        time: 300000,
        max: 1,
      });
      const exit = await this.collect(serverQueue, collector, msg);
      if (exit) {
        msg.author.send('Wizard stopped!');
        break;
      }
    }
  }
  private async collect(
    serverQueue: Vote,
    collector: MessageCollector,
    message: Message
  ) {
    return new Promise((res, rej) => {
      collector.on('collect', async collected => {
        if (collected.content === 'stop') {
          const channel = collected.channel.client.channels
            .findAll('type', 'dm')
            .find(
              c =>
                (c as DMChannel).recipient.username === message.author.username
            );
          const fetched = await (channel! as DMChannel).fetchMessages({
            limit: 100,
          });
          (channel! as TextChannel).bulkDelete(fetched);
          await (channel! as DMChannel).delete();
          ServerQueueController.getInstance().findAndRemoveVote(
            message.guild.id,
            serverQueue
          );
          res(true);
        } else {
          serverQueue.currentStep++;
        }
        res(false);
      });
    });
  }
}
