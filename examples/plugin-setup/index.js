const { Bot } = require('@vocality-org/core');
const { music } = require('@vocality-org/music');
const { votesPlugin } = require('@vocality-org/votes');
const { plugin } = require('./my-plugin/MyPlugin');

music.spotify = 'SPOTIFY_CLIENT_SECRET';

const options = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [music, plugin, votesPlugin],
};

const bot = new Bot(options);

bot.start();
