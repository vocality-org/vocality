import { Plugin, PluginConfig, Command } from '@vocality-org/types';

export abstract class BasePlugin implements Plugin {
  config: PluginConfig;
  commands: Command[];

  constructor(config?: PluginConfig) {
    this.commands = [];
    this.config = config || { loaded: false };
  }

  enable(guildId: string, config?: PluginConfig) {
    this.config = config || { loaded: true };
    this.load?.(guildId);
  }

  disable(guildId: string) {
    this.config.loaded = false;
    this.unload?.(guildId);
  }

  /**
   * Returns a new instance of the plugin. First method executed when a plugin
   * gets loaded.
   */
  protected load?(guildId: string): void;

  /**
   * Last tasks to execute before the plugin gets unloaded.
   */
  protected unload?(guildId: string): void;
}
