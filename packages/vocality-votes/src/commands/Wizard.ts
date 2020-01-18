import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { loadCommands } from '@vocality-org/core';
import * as wizardSubCommands from './wizard';
import { ServerQueueController } from '../controller/ServerQueueController';

export class Wizard implements Command {
  options: CommandOptions = {
    id: {
      name: 'wizard',
    },
    description: 'Start a wizard for your poll',
    minArguments: 1,
  };
  subCommands: Command[] = loadCommands(wizardSubCommands);
  async execute(msg: Message, args: string[]) {
    const serverQueue = ServerQueueController.getInstance().findOrCreateFromMessage(
      msg
    );
    this.subCommands
      .find(sc => sc.options.id.name === args[0])
      ?.execute(msg, args);
    msg.channel.send('Your Setup my lord' + serverQueue.question);
  }
}
