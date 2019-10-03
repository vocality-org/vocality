import { BotClient } from './core/BotClient';
import { MessageHandler } from './core/handlers/MessageHandler';
import { SocketCommandHandler } from './core/handlers/SocketCommandHandler';
import { Spotify } from './musicAPIs/Spoitfy';

import './dashboard-ws';

export const bot = new BotClient({
    messageCacheMaxSize: 100,
    disabledEvents: ['TYPING_START'],
});

(async () => {
    await bot.init();
    bot.messageHandler = new MessageHandler(bot);
    bot.socketHandler = new SocketCommandHandler(bot);
    await new Spotify().init();
})();
