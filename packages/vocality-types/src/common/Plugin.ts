import { Command } from '../bot/command';

export interface Plugin {
  /**
   * List of all the commands the plugin should provide
   */
  commands?: Command[];

  /**
   * Plugin config
   *
   */
  config: PluginConfig;

  enable(guildId: string, config?: PluginConfig): void;
  disable(guildId: string): void;
}

export interface PluginConfig {
  /**
   * Whether the plugin is loaded or not.
   */
  loaded: boolean;

  /**
   * Path of the plugin to load.
   */
  path?: string;

  /**
   * The plugins ui name.
   */
  displayName?: string;
}
