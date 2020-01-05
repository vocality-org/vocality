import { BasePlugin, loadCommands } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';

import './dashboard-ws/index';
import * as commandDefs from './commands';

class MusicPlugin extends BasePlugin {
  commands!: SocketCommand[];

  load() {
    this.commands = loadCommands(commandDefs) as SocketCommand[];
    return this;
  }

  unload() {}
}

export default new MusicPlugin();
