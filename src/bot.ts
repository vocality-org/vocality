import { BotClient } from "./classes/BotClient";
import { MessageHandler } from "./classes/MessageHandler";
import { Spotify } from "./musicAPIs/Spoitfy";

export const bot = new BotClient({
  messageCacheMaxSize: 100,
  disabledEvents: ["TYPING_START"]
});

(async () => {
  await bot.init();
  const spotify = new Spotify();
  await spotify.init();
  const mh = new MessageHandler(bot);
})();
