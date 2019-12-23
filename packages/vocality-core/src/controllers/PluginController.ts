import { Plugin, Plugins } from '@vocality-org/types';
import { Collection } from 'discord.js';

export class PluginController {
  readonly plugins: Collection<string, Plugin[]>;

  constructor() {
    this.plugins = new Collection<string, Plugin[]>();
  }

  guildPlugins(guildId: string): Plugin[] {
    const plugins = this.plugins.get(guildId);
    return plugins ? plugins : [];
  }

  /**
   * Loads a list of plugins. Plugins are expected to extend the BasePlugin.
   *
   * @param {string} guildId The guild to load the plugins for
   * @param {Plugins} plugins an object whose keys are plugin names and whose
   * values are plugin configs.
   */
  load(guildId: string, plugins: Plugins) {
    const toLoad = filterPlugins(plugins);

    Object.keys(toLoad).forEach(name => {
      const config = toLoad[name];
      import(config.path).then(module => {
        this.plugins.set(guildId, module.plugin.enable(config));
      });
    });

    return this;
  }

  /**
   * Unloads a plugin by invoking the plugins disable method.
   *
   * @param {string} guildId The guild to unload the plugin for
   * @param {Plugin} plugin The plugin to unload
   */
  unload(guildId: string, plugin: Plugin) {
    const plugins = this.plugins.get(guildId);
    const toUnload = plugins?.find(p => p === plugin);

    if (toUnload) {
      toUnload.disable();
      this.plugins.get(guildId)!.splice(plugins!.indexOf(toUnload), 1);
    }
  }

  /**
   * Unloads all plugins
   *
   * @param {string} guildId The guild to unload all plugins for
   */
  unloadAll(guildId: string) {
    this.plugins.forEach(p => {
      this.plugins.get(guildId)?.forEach(p => {
        this.unload(guildId, p);
      });
    });
  }
}

/**
 * Returns a Plugins Object that meets following criteria:
 *
 * 1) Plugin is enabled
 * 2) Plugin has non-empty path
 */
function filterPlugins(plugins: Plugins): Plugins {
  const keys = Object.keys(plugins);
  return keys.reduce((acc: Plugins, key: string) => {
    if (plugins[key].enabled && plugins[key].path) acc[key] = plugins[key];
    return acc;
  }, {});
}
