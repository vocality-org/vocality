export interface Plugin {
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
