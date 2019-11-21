import { ResponseClient, ResponseClientOptions } from 'discord-response-mock';
import { BOT } from '../../src/config';
import { TEST_DISCORD_DATA } from './config';

import { current } from './Current.test';
import { lyrics } from './Lyrics.test';
import { skip } from './Skip.test';
import { loop } from './Loop.test';

const options: ResponseClientOptions = {
  channelId: TEST_DISCORD_DATA.TEST_CHANNEL_ID,
  voiceChannelId: TEST_DISCORD_DATA.TEST_VOICE_ID,
  messagePrefix: BOT.PREFIX,
  specificUserId: '589595189631385602', // vocality bot id
  responseTimeout: 4000,
};

export let client = new ResponseClient(options);

describe('commands', function() {
  this.timeout(options.responseTimeout!);

  before(async () => {
    client = await client.connect(
      TEST_DISCORD_DATA.BOT_TOKEN,
      TEST_DISCORD_DATA.GUILD_ID
    );
  });

  describe('current', () => {
    current(client);
  });

  describe('lyrics', () => {
    lyrics(client);
  });

  describe('skip', () => {
    skip(client);
  });
  describe('loop', () => {
    loop(client);
  });

  after(async () => {
    await client.cleanup();
  });
});
