import { Plugin, PluginConfig } from '@vocality-org/types';

export interface Plugins {
  [pluginName: string]: PluginConfig;
}

export class PluginController {
  private _plugins: Plugin[] = [];

  /**
   * Loads a list of plugins. Plugins are expected to extend the BasePlugin.
   *
   * @param {Plugins} plugins an object whose keys are plugin names and whose
   * values are plugin configs.
   */
  load(plugins: Plugins) {
    const toLoad = filterPlugins(plugins);

    Object.keys(toLoad).forEach(name => {
      const config = toLoad[name];
      import(config.path).then(module => {
        this._plugins.push(module.plugin.enable(config));
      });
    });
  }

  /**
   * Unloads a plugin by invoking the plugins disable method.
   *
   * @param {Plugin} plugin The plugin to unload
   */
  unload(plugin: Plugin) {
    const toUnload = this._plugins.find(p => p === plugin);
    if (toUnload) {
      toUnload.disable();
      this._plugins.splice(this._plugins.indexOf(toUnload), 1);
    }
  }

  /**
   *Unloads all plugins
   *
   * @memberof PluginLoader
   */
  unloadAll() {
    this._plugins.forEach(p => {
      this.unload(p);
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
