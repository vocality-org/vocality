import { Plugin, PluginConfig, Command } from '@vocality-org/types';
import { BaseHandler } from './BaseHandler';

export abstract class BasePlugin implements Plugin {
  protected _config!: PluginConfig;
  protected handlers?: BaseHandler<any>[];
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
