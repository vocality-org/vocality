import { random } from '@vocality-org/random';
import { ClientOptions } from '@vocality-org/types';
import { Bot } from '@vocality-org/core/build/src';
import { votesPlugin } from '@vocality-org/votes';
import dotenv from 'dotenv';

dotenv.config();

random.randomOrgApiKey = 'RANDOM_ORG_KEY';

const options: ClientOptions = {
  token: process.env.BOT_TOKEN,
  plugins: [random, votesPlugin],
};

const bot: Bot = new Bot(options);

bot.start();
