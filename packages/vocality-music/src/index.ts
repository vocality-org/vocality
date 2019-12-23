import { BasePlugin, Exporter } from '@vocality-org/core';
import { Command } from '@vocality-org/types';

import * as commandDefs from './commands';
import { SocketCommandHandler } from './handlers/SocketCommandHandler';

class MusicPlugin extends BasePlugin {
  commands!: Command[];

  initialize() {
    this.commands = Exporter.loadCommands(commandDefs);
    return this;
  }

  destroy() {}
}

export const plugin = new MusicPlugin();
