import { BasePlugin, loadCommands } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';

import { socketio as dashboardSocket } from './dashboard-ws';
import * as commandDefs from './commands';
import { ServerQueueController } from './controller/ServerQueueController';

class MusicPlugin extends BasePlugin {
  commands: SocketCommand[];

  constructor() {
    super();
    this.config.displayName = 'vocality-music';
    this.commands = loadCommands(commandDefs) as SocketCommand[];
    console.log(dashboardSocket.local);
  }

  load(guildId: string) {
    ServerQueueController.getInstance().findOrCreateFromGuildId(guildId);
  }

  unload(guildId: string) {
    ServerQueueController.getInstance().remove(guildId);
  }
}

export const music = new MusicPlugin();
