import { BotClient } from './classes/BotClient';
import { MessageHandler } from './classes/MessageHandler';

export const bot = new BotClient({
    messageCacheMaxSize: 100,
    disabledEvents: ['TYPING_START'],
});

(async () => {
    await bot.init();
    const mh = new MessageHandler(bot);
})()