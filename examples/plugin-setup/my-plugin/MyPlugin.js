import { BasePlugin, loadCommands } from '@vocality-org/core';

class MyPlugin extends BasePlugin {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.commands = loadCommands(commandDefs);
    return this;
  }
}

export const plugin = new MyPlugin();
