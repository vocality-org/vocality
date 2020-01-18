import { Message } from 'discord.js';
import { BotClient } from '../bot/BotClient';
/**
 *  Method for adds a custom, discord related event for the bot to listen on e.g. 'channelCreate'
 *
 * @param {string} event
 * @param {(msg: Message) => void} callback
 */
export const addCustomListener = (
  event: string,
  callback: (msg: Message) => void
) => {
  BotClient.instance().addCustomListener(event, callback);
};
