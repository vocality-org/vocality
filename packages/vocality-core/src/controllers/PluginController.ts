import { Plugin, Plugins } from '@vocality-org/types';
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
   * Adds a list of imported plugin modules to given guild. Plugin modules are expected to extend the BasePlugin and
   * exprot an object named plugin.
   *
   * @param {string} guildId The guild to add the plugins to
   * @param {Plugins} plugins an object whose keys are plugin names and whose
   * values are plugin configs.
   */
  importAndAdd(guildId: string, pluginArray: Plugins) {
    pluginArray.forEach(c => {
      const config = c;
      try {
        import(config.path).then(module => {
          this.plugins.set(guildId, module.plugin.enable(config));
        });
      } catch (e) {
        console.log(e);
      }
    });

    return this;
  }

  /**
   * Add a plugin to a given guild
   *
   * @param {string} guildId
   * @param {Plugin} plugin instance of a plugin
   */
  addPlugin(guildId: string, plugin: Plugin) {
    const existingList = this.plugins.get(guildId);

    if (!existingList) {
      this.plugins.set(guildId, [plugin]);
    } else {
      this.plugins.set(guildId, [...existingList, plugin]);
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
    const toUnload = plugins?.find(p => p === plugin);

    if (toUnload) {
      toUnload.disable();
      toUnload.config.loaded = false;
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
