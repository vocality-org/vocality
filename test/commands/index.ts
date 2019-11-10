import { ResponseClient, ResponseClientOptions } from 'discord-response-mock';
import { BOT } from '../../src/config';
import { DISCORD_TEST } from './config';

import { current } from './Current.test';
import { lyrics } from './Lyrics.test';
import { skip } from './Skip.test';
import { loop } from './Loop.test';

const options: ResponseClientOptions = {
  channelId: DISCORD_TEST.TEST_CHANNEL_ID,
  messagePrefix: BOT.PREFIX,
  specificUserId: '589595189631385602', // vocality bot id
  responseTimeout: 4000,
};

export let client = new ResponseClient(options);

describe('commands', function() {
  this.timeout(options.responseTimeout!);

  before(async () => {
    client = await client.connect(
      DISCORD_TEST.BOT_TOKEN,
      DISCORD_TEST.GUILD_ID
    );
  });

  describe('current', () => {
    current.call(null, client);
  });

  describe('lyrics', () => {
    lyrics.call(null, client);
  });

  describe('skip', () => {
    skip.call(null, client);
  });
  describe('loop', () => {
    loop.call(null, client);
  });

  after(async () => {
    await client.cleanup();
  });
});
