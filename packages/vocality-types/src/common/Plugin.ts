import { Command } from '../bot/command';

export interface Plugin {
  /**
   * List of all the commands the plugin should provide
   */
  commands?: Command[];

  config: PluginConfig;

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
 * Array of enabled and path values
 */
export type Plugins = { enabled: boolean; path: string }[];
