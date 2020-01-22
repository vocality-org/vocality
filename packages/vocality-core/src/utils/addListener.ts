import { BotClient } from '../bot/BotClient';
/**
 *  Method for adds a custom, discord related event for the bot to listen on e.g. 'channelCreate'
 *
 * @param {string} event
 * @param {(msg: Message) => void} callback
 */
export const addCustomListener = (event: string, callback: Function) => {
  console.log('sd');

  BotClient.instance().addCustomListener(event, callback);
};
