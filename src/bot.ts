import { BotClient } from './core/BotClient';
import { Spotify } from './musicAPIs/Spoitfy';

import './dashboard-ws';

export const bot = new BotClient({
  messageCacheMaxSize: 100,
  disabledEvents: ['TYPING_START'],
});

(async () => {
  await bot.init();
  await new Spotify().init();
})();
