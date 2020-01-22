import { Plugin } from '@vocality-org/types';
import { Collection } from 'discord.js';

export class PluginController {
  /**
   * Contains all enabled and disabled plugins
   */
  readonly plugins: Collection<string, Plugin[]>;

  constructor() {
    this.plugins = new Collection<string, Plugin[]>();
  }

  /**
   * Return all enabled plugins for a given guild
   */
  getLoadedPluginsInGuild(guildId: string) {
    const loaded = this.plugins.get(guildId)?.filter(p => p.config.loaded);

    return loaded ? loaded : [];
  }

  /**
   * Return all plugins of the current guild
   */
  getGuildPlugins(guildId: string): Plugin[] {
    let plugins = this.plugins.get(guildId);
    if (!plugins) {
      plugins = [];
    } else {
      plugins = Array.isArray(plugins) ? plugins : [plugins];
    }

    return plugins;
  }

  /**
   * Add a plugin to a given guild and loads it.
   *
   * @param {string} guildId
   * @param {Plugin} plugin instance of a plugin
   */
  addPlugin(guildId: string, plugin: Plugin) {
    plugin.enable(guildId);
    const existingList = this.plugins.get(guildId);

    if (!existingList) {
      this.plugins.set(guildId, [plugin]);
    } else {
      this.plugins.set(guildId, [...existingList, plugin]);
    }
  }

  /**
   * Loads a plugin that was enabled and unloaded
   *
   * @param {string} guildId In which guild the plugin should be loaded
   * @param {Plugin} plugin The plugin that should be loaded
   */
  load(guildId: string, plugin: Plugin) {
    const plugins = this.plugins.get(guildId);

    if (!plugins) {
      return;
    }

    const toLoad = plugins.find(p => p === plugin);

    if (toLoad) {
      if (!toLoad.config.loaded) {
        toLoad.enable(guildId);
      }
    }
  }

  /**
   * Unloads a plugin by invoking the plugins disable method.
   *
   * @param {string} guildId The guild to unload the plugin for
   * @param {Plugin} plugin The plugin to unload
   */
  unload(guildId: string, plugin: Plugin) {
    const plugins = this.plugins.get(guildId);

    if (!plugins) {
      return;
    }

    const toUnload = plugins.find(p => p === plugin);

    if (toUnload) {
      toUnload.disable(guildId);
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
