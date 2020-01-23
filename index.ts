import { Bot } from './packages/vocality-core/src/index';
import { ClientOptions } from './packages/vocality-types/src/bot/Client';
import dotenv from 'dotenv';
import { votesPlugin } from './packages/vocality-votes/src';
import { random } from './packages/vocality-random/src';

dotenv.config();

random.randomOrgApiKey = process.env.RANDOM_ORG_KEY!;

const options: ClientOptions = {
  token: process.env.BOT_TOKEN,
  messageCacheMaxSize: 100,
  disabledEvents: ['TYPING_START'],
  plugins: [
    votesPlugin,
    random,
    // { enabled: true, path: 'other/plugin' },
  ],
};

const bot = new Bot(options);

bot.start();
