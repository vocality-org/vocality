import { BasePlugin, loadCommands } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';

import './dashboard-ws/index';
import * as commandDefs from './commands';

class MusicPlugin extends BasePlugin {
  commands: SocketCommand[];

  constructor() {
    super();
    this.config.displayName = 'vocality-music';
    this.commands = loadCommands(commandDefs) as SocketCommand[];
  }

  load() {
    return this;
  }

  unload() {}
}

export const music = new MusicPlugin();
