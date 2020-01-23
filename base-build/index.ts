import { random } from '@vocality-org/random';
import { ClientOptions } from '@vocality-org/types';
import { Bot } from '@vocality-org/core/build/src';
import { votesPlugin } from '@vocality-org/votes';

random.randomOrgApiKey = 'RANDOM_ORG_KEY';

const options: ClientOptions = {
  token: 'NTg5NTk1MTg5NjMxMzg1NjAy.XfesHg.x6F_h7GMsYZ8t29LrpoM2eEKJ-c',
  plugins: [random, votesPlugin],
};

const bot: Bot = new Bot(options);

bot.start();
