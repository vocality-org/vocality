import { Command } from '../bot/command';

export interface Plugin {
  /**
   * List of all the commands the plugin should provide
   */
  commands?: Command[];

  enable(config: PluginConfig): Plugin;
  disable(): void;
}

export interface PluginConfig {
  /**
   * Whether to enable the plugin.
   */
  enabled: boolean;

  /**
   * Path of the plugin to load.
   */
  path: string;

  /**
   * The plugins ui name.
   */
  displayName?: string;
}

/**
 * Object with keys as plugin names and configurations as value
 */
export interface Plugins {
  [pluginName: string]: PluginConfig;
}
