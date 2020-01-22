import { Bot } from '@vocality-org/core';
import { ClientOptions } from '@vocality-org/types';
import { votesPlugin } from '@vocality-org/votes';
import { random } from '@vocality-org/random';

random.randomOrgApiKey = 'RANDOM_ORG_KEY';

const options: ClientOptions = {
  token: 'DISCORD_BOT_TOKEN',
  plugins: [random, votesPlugin],
};

const bot: Bot = new Bot(options);

bot.start();
