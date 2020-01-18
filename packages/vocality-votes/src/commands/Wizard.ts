import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { loadCommands } from '@vocality-org/core';
import * as wizardSubCommands from './wizard';

export class Wizard implements Command {
  options: CommandOptions = {
    id: {
      name: 'wizard',
    },
    description: 'Start a wizard for your poll',
    minArguments: 1,
  };
  subCommands: Command[] = loadCommands(wizardSubCommands);
  async execute(msg: Message, args: string[]) {}
}
