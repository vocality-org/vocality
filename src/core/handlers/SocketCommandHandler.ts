import { Message, TextChannel } from 'discord.js';
import  BotClient  from '../BotClient';
import { ArgumentParser } from '../ArgumentParser';
import { BotError } from '../BotError';
import { SocketCommand } from '../../dashboard-ws';
import { BotHandler } from './BotHandler';

export class SocketCommandHandler extends BotHandler {
    constructor(bot: BotClient) {
        super(bot);
    }

    handleSocketCommand(socketCommand: SocketCommand) {
        const command = this.bot.commands.get(socketCommand.name)!;

        if (!command.options.socketEnabled) {
            throw new BotError('Command not enabled for websockets');
        }

        const error = ArgumentParser.validateArguments(command, socketCommand.args);

        if (error) {
            throw error;
        }

        try {
            // maybe add a default text channel feature to the bot later
            // which the user can set per command and we would take that channel
            // for now we take the first text channel
            const guild = this.bot.guilds.filter(g => g.id === socketCommand.messageData.guildId).first();
            const textChannel = guild.channels
                .filter(c => {
                    return c.type === 'text';
                })
                .first() as TextChannel;
            const message = new Message(textChannel, { author: this.bot.user, embeds: [], attachments: [] }, this.bot);
            command.execute(message, socketCommand.args);
        } catch (error) {
            console.log(error);
        }
    }
}
