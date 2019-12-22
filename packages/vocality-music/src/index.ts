import { BasePlugin, loadCommands } from '@vocality-org/core';
import { Command } from '@vocality-org/types';

import * as dotenv from 'dotenv';

import * as commandDefs from './commands';

dotenv.config();

export class MusicPlugin extends BasePlugin {
  commands!: Command[];

  initialize() {
    this.commands = loadCommands(commandDefs);
    return this;
  }

  destroy() {}
}

export const plugin = new MusicPlugin();
