import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { loadCommands } from '@vocality-org/core';
import * as archivedsubCommands from './archived';

export class Archived implements Command {
  options: CommandOptions = {
    id: {
      name: 'archived',
    },
    description: 'shows your archived Polls either as list or detailed',
    minArguments: 1,
  };
  subCommands: Command[] = loadCommands(archivedsubCommands);
  async execute(msg: Message, args: string[]) {}
}
