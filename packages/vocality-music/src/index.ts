import { BasePlugin, loadCommands } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';

import './dashboard-ws/index';
import * as commandDefs from './commands';

class MusicPlugin extends BasePlugin {
  commands!: SocketCommand[];

  initialize() {
    this.commands = loadCommands(commandDefs) as SocketCommand[];
    return this;
  }

  destroy() {}
}

export const plugin = new MusicPlugin();
