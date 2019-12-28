import { BasePlugin, Exporter } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';

import * as commandDefs from './commands';

class MusicPlugin extends BasePlugin {
  commands!: SocketCommand[];

  initialize() {
    this.commands = Exporter.loadCommands(commandDefs) as SocketCommand[];
    return this;
  }

  destroy() {}
}

export const plugin = new MusicPlugin();
