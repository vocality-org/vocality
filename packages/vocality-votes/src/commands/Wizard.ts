import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { ServerQueueController } from '../controller/ServerQueueController';

import { WizardUtils } from '../utils/WizardUtils';

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
      const embed = WizardUtils.getQuestion(serverQueue.currentStep);
      const message = await msg.author.send({ embed });
      const m = message as Message;
      const collector = m.channel.createMessageCollector(m => m.content, {
        time: 300000,
        max: 1,
      });
      const exit = await WizardUtils.collect(serverQueue, collector, msg, m);
      if (exit) {
        msg.author.send('Wizard stopped!');
        break;
      }
    }
  }
}
