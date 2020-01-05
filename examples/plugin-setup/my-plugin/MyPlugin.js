const vocality = require('@vocality-org/core');
const commands = require('./commands');

class MyPlugin extends vocality.BasePlugin {
  constructor() {
    super();
    this.commands = [];
    Object.keys(commands).forEach(k => this.commands.push(commands[k]));
  }

  load() {
    console.log('plugin was loaded');
    return this;
  }

  unload() {
    console.log('plugin was unloaded');
  }
}

module.exports = new MyPlugin();
