import { Bot } from '@vocality-org/core';
import { ClientOptions } from '@vocality-org/types';
import { music } from '@vocality-org/music';

music.spotify = 'SPOTIFY_CLIENT_SECRET';

const options: ClientOptions = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [music],
};

const bot: Bot = new Bot(options);

bot.start();
