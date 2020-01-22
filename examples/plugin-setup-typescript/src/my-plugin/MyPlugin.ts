import { BasePlugin, loadCommands } from '@vocality-org/core';

import * as commandsModule from '../commands';

class MyPlugin extends BasePlugin {
  constructor() {
    super();
    this.commands = loadCommands(commandsModule);
  }

  load(guildId: string) {
    console.log(`plugin was loaded on guild ${guildId}`);
  }

  unload(guildId: string) {
    console.log(`plugin was unloaded on guild ${guildId}`);
  }
}

export const plugin = new MyPlugin();
