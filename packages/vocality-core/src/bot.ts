import { BotClient } from './bot/BotClient';

export const bot = new BotClient({
  messageCacheMaxSize: 100,
  disabledEvents: ['TYPING_START'],
});

(async () => {
  await bot.init();
})();
