import {
  Plugin,
  PluginConfig,
} from '@vocality-org/types/build/src/common/Plugin';

export abstract class BasePlugin implements Plugin {
  protected _config!: PluginConfig;

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
