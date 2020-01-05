import { Plugin, PluginConfig, Command } from '@vocality-org/types';

export abstract class BasePlugin implements Plugin {
  config: PluginConfig;
  commands: Command[];

  constructor(config?: PluginConfig) {
    this.commands = [];
    this.config = config || { loaded: false };
  }

  enable(config?: PluginConfig): Plugin {
    this.config = config || { loaded: true };
    return this.load();
  }

  disable() {
    this.config.loaded = false;
    this.unload();
  }

  /**
   * Returns a new instance of the plugin. First method executed when a plugin
   * gets loaded.
   */
  protected abstract load(): Plugin;

  /**
   * Last tasks to execute before the plugin gets unloaded.
   */
  protected abstract unload(): void;
}
