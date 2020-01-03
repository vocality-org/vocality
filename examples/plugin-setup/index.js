const vocality = require('@vocality-org/core');
const plugin = require('./my-plugin/MyPlugin');

const options = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [
    { loaded: true, path: '@vocality-org/music' },
    // { loaded: true, path: 'some-other-plugin' },
  ],
};

const bot = new vocality.Bot(options);

console.log(plugin);

bot.addPlugin(plugin);
bot.start();
