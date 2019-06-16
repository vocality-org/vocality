import { Message } from 'discord.js';
import { BotClient } from './BotClient';

export class MessageHandler {
    bot: BotClient;
    
    constructor(bot: BotClient) {
        this.bot = bot;
        this.addListeners();
    }

    addListeners() {
        this.bot.on('message', msg => this.onMessage(msg));
        this.bot.on('messageUpdate', msg => this.onMessageUpdate(msg));
        this.bot.on('raw', (msg: any) => this.onRaw(msg));
    }

    onMessage(message: Message) {
        // call the ArgumentParser
        // execute the Command
    }

    onMessageUpdate(msg: Message) {

    }

    onRaw(msg: any) {
        //? https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
    }
}