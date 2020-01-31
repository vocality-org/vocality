import { Command, CommandOptions } from '@vocality-org/types';

import { Message } from 'discord.js';

import { ServerQueueController } from '../../controller/ServerQueueController';

import { WizardUtils } from '../../utils/WizardUtils';
import { VotingUtils } from '../../utils/VotingUtils';

export class Advanced implements Command {
  options: CommandOptions = {
    id: {
      name: 'advanced',
    },
    description: 'Start a poll with advanced settings',
    usage: '?wizard advanced',
    minArguments: 0,
  };

  async execute(msg: Message, args: string[]) {
    const serverQueue = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    serverQueue.maxSteps = 4;
    const stopped = await WizardUtils.executeLogic(serverQueue, msg);
    if (!stopped) {
      VotingUtils.displayMessage(msg, serverQueue, false);
    }

    return;
  }
}
