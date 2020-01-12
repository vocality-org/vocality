import { Bot } from './packages/vocality-core/src/index';
import { ClientOptions } from './packages/vocality-types/build/src/bot/Client';
import dotenv from 'dotenv';
import { votesPlugin } from './packages/vocality-votes/src';

dotenv.config();
const options: ClientOptions = {
  token: process.env.BOT_TOKEN,
  messageCacheMaxSize: 100,
  disabledEvents: ['TYPING_START'],
  plugins: [
    votesPlugin,
    // { enabled: true, path: 'other/plugin' },
  ],
};

const bot = new Bot(options);

bot.start();
