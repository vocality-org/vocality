import { BasePlugin, loadCommands } from '@vocality-org/core';
import { Command } from '@vocality-org/types';

import * as commandDefs from './commands';

class ModerationPlugin extends BasePlugin {
  commands: Command[];

  constructor() {
    super();
    this.config.displayName = 'vocality-moderation';
    this.commands = loadCommands(commandDefs);
  }
}

export const moderation = new ModerationPlugin();
