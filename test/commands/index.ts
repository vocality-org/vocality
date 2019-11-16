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
        client = await client.connect(DISCORD_TEST.BOT_TOKEN, DISCORD_TEST.GUILD_ID);
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
