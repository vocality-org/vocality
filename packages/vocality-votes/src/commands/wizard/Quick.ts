import { Command, CommandOptions } from '@vocality-org/types';

import { Message } from 'discord.js';

import { ServerQueueController } from '../../controller/ServerQueueController';

import { WizardUtils } from '../../utils/WizardUtils';
import { VotingUtils } from '../../utils/VotingUtils';

export class Quick implements Command {
  options: CommandOptions = {
    id: {
      name: 'quick',
    },
    description: 'Start a poll with reduced settings',
    usage: '?wizard quick',
    minArguments: 0,
  };

  async execute(msg: Message, args: string[]) {
    const serverQueue = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    serverQueue.maxSteps = 3;
    const stopped = await WizardUtils.executeLogic(serverQueue, msg);
    console.log(stopped);
    if (!stopped) {
      VotingUtils.displayMessage(msg, serverQueue, false);
    }
    return;
  }
}
