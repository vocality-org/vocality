import { BotClient } from './bot/BotClient';
import { PluginController } from './controllers/PluginController';
import { DEFAULT_PLUGINS } from './config';

export const bot = new BotClient({
  messageCacheMaxSize: 100,
  disabledEvents: ['TYPING_START'],
});

const pluginController = new PluginController();

(async () => {
  await bot.init();
  pluginController.load(DEFAULT_PLUGINS);
})();
