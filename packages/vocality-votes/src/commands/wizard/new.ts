import { Command, CommandOptions } from '@vocality-org/types';

import { Message } from 'discord.js';

import { ServerQueueController } from '../../controller/ServerQueueController';

import { WizardUtils } from '../../utils/WizardUtils';
import { VotingUtils } from '../../utils/VotingUtils';

export class New implements Command {
  options: CommandOptions = {
    id: {
      name: 'new',
    },
    description: 'Start a poll with advanced settings',
    minArguments: 0,
  };

  async execute(msg: Message, args: string[]) {
    const serverQueue = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    serverQueue.maxSteps = 4;
    await WizardUtils.executeLogic(serverQueue, msg);
    VotingUtils.displayMessage(msg, serverQueue, false);
    return;
  }
}
