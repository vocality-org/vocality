import { Plugin, PluginConfig, Command } from '@vocality-org/types';

export abstract class BasePlugin implements Plugin {
  config: PluginConfig;
  commands: Command[];

  constructor() {
    this.commands = [];
    this.config = { loaded: false };
  }

  enable(config: PluginConfig): Plugin {
    this.config = config;
    return this.initialize();
  }

  disable() {
    this.destroy();
  }

  /**
   * Returns a new instance of the plugin.
   */
  protected abstract initialize(): Plugin;

  /**
   * Last tasks to execute before the plugin gets disabled.
   */
  protected abstract destroy(): void;
}
