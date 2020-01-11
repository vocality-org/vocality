const { Bot } = require('@vocality-org/core');
const { music } = require('@vocality-org/music');
const { plugin } = require('./my-plugin/MyPlugin');

const options = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [music, plugin],
};

const bot = new Bot(options);

bot.start();