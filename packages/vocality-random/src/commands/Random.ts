import { loadCommands } from '@vocality-org/core';
import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';

import * as randomSubCommands from './random';

export class Random implements Command {
  options: CommandOptions = {
    id: {
      name: 'random',
      aliases: ['rndm', 'rand'],
    },
    description: 'Executes a random command',
    usage: 'random',
  };

  subCommands: Command[] = loadCommands(randomSubCommands);

  execute(msg: Message, args: string[]) {}
}
