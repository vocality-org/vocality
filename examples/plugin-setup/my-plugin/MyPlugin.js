const vocality = require('@vocality-org/core');
const commands = require('./commands');

class MyPlugin extends vocality.BasePlugin {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    this.commands = [];
    Object.keys(commands).forEach(k => this.commands.push(commands[k]));
    return this;
  }
}

module.exports = new MyPlugin();
