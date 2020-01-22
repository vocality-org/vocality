import { BotClient } from '../bot/BotClient';

export const emitCustomEvent = (event: string, ...args: any[]) => {
  BotClient.instance().emitCustomEvent(event, args);
};
