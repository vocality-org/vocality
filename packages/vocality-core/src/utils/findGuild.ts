import { BotClient } from '../bot/BotClient';

export const findGuild = (guildId: string) => {
  return BotClient.instance().findGuild(guildId);
};
