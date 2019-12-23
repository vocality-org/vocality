import { Plugin, PluginConfig, Command } from '@vocality-org/types';

export abstract class BasePlugin implements Plugin {
  protected _config!: PluginConfig;
  abstract commands: Command[];

  enable(config: PluginConfig): Plugin {
    this._config = config;
    return this.initialize();
  }

  disable() {
    this.destroy();
  }

  /**
   * Returns a new instance of the plugin.
   */
  protected abstract initialize(): Plugin;

  protected abstract destroy(): void;
}
