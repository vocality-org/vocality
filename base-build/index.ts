import { random } from '@vocality-org/random';
import { ClientOptions } from '@vocality-org/types';
import { Bot } from '@vocality-org/core/build/src';
import { votesPlugin } from '@vocality-org/votes';
import { music } from '@vocality-org/music';
import dotenv from 'dotenv';

dotenv.config();

random.randomOrgApiKey = 'RANDOM_ORG_KEY';

const options: ClientOptions = {
  token: process.env.BOT_TOKEN,
  plugins: [random, votesPlugin, music],
};
votesPlugin.saveBackupPath(__dirname + '/' + 'votingResults.json');
const bot: Bot = new Bot(options);
music.spotify_client_id = '<your spotify CLIENT_ID>';
music.spotify_secret = '<your spotify SECRET>';
music.genius = '<<your genius API TOKEN>';
bot.start();
