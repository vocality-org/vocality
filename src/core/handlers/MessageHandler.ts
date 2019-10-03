import { BotHandler } from './BotHandler';
import { Message } from 'discord.js';
import { BotClient } from '../BotClient';
import { Bot } from '../../config';
import { ArgumentParser } from '../ArgumentParser';
import { BotError } from '../BotError';

export class MessageHandler extends BotHandler {
    constructor(bot: BotClient) {
        super(bot);
        this.addListeners();
    }

    addListeners() {
        this.bot.on('message', msg => this.handleMessage(msg));
        this.bot.on('messageUpdate', msg => this.handleMessageUpdate(msg));
    }

    handleMessage(message: Message) {
        if (!this.validateMessage(message)) return;

        const content = message.content.slice(Bot.SERVERPREFIXES[message.guild.id].length);
        const args = ArgumentParser.parse(content);

        if (args instanceof BotError) {
            message.reply(args.message);
        } else {
            const commandtext = args.shift()!.toLowerCase();

            if (!this.bot.commands.has(commandtext)) {
                message.reply('Unknown command!');
            } else {
                const command = this.bot.commands.get(commandtext)!;
                const error = ArgumentParser.validateArguments(command, args);
                if (error) {
                    message.reply(error.message);
                } else {
                    try {
                        this.bot.commands.get(commandtext)!.execute(message, args);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
    }

    handleMessageUpdate(msg: Message): void {}

    private validateMessage(message: Message): boolean {
        return !message.author.bot && message.content.startsWith(Bot.SERVERPREFIXES[message.guild.id]);
    }
}
