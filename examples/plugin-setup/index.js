const vocality = require('@vocality-org/core');
const plugin = require('./my-plugin/MyPlugin');

const options = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [
    { loaded: true, path: '@vocality-org/music' },
    // { loaded: false, path: 'some-other-plugin' },
  ],
};

const bot = new vocality.Bot(options);

bot.addPlugin(plugin);
bot.start();
