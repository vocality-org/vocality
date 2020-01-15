const vocality = require('@vocality-org/core');
const commands = require('./commands');

class MyPlugin extends vocality.BasePlugin {
  constructor() {
    super();
    this.commands = [];
    Object.keys(commands).forEach(k => this.commands.push(commands[k]));
  }

  load(guildId) {
    console.log(`plugin was loaded (${guildId})`);
  }

  unload(guildId) {
    console.log(`plugin was unloaded (${guildId})`);
  }
}

module.exports = { plugin: new MyPlugin() };
