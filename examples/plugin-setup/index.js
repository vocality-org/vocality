import { Bot } from '@vocality-org/core';
import { plugin } from './my-plugin';

const options = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [
    { enabled: true, path: '@vocality-org/music' },
    // { enabled: true, path: 'other/plugin' },
  ],
};

const bot = new Bot(options);

bot.loadPlugin(plugin);
bot.start();
