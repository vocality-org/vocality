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
    let hasErr = false;
    let newMsg;
    let oldMsg;
    while (serverQueue.currentStep < serverQueue.maxSteps) {
      let message;
      let collector;
      if (hasErr) {
        const m = (await oldMsg?.edit({ embed: newMsg })) as Message;
        collector = m.channel.createMessageCollector(m => m.content, {
          time: 300000,
          max: 1,
        });
      } else {
        const embed = WizardUtils.getQuestion(serverQueue.currentStep);
        message = await msg.author.send({ embed });
        const m = message as Message;
        oldMsg = m;
        collector = m.channel.createMessageCollector(m => m.content, {
          time: 300000,
          max: 1,
        });
      }

      const collectedAnswer = await WizardUtils.collect(
        serverQueue,
        collector,
        msg
      );
      if (collectedAnswer.exit) {
        msg.author.send('Wizard stopped!');
        break;
      } else {
        const error = await WizardUtils.handleAnswer(
          serverQueue,
          collectedAnswer.collected!.content
        );
        console.log(error);
        if (!error.error) {
          hasErr = false;
          serverQueue.currentStep++;
        } else {
          hasErr = true;
          newMsg = error.newMsg;
        }
      }
    }
  }
}
