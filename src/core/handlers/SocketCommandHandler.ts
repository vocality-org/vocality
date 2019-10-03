import { Message, TextChannel } from 'discord.js';
import { BotClient } from '../BotClient';
import { ArgumentParser } from '../ArgumentParser';
import { BotError } from '../BotError';
import { SocketCommand } from '../../dashboard-ws';
import { BotHandler } from './BotHandler';

export class SocketCommandHandler extends BotHandler {
    constructor(bot: BotClient) {
        super(bot);
    }

    // called by dashboard-ws.ts
    handleSocketCommand(socketCommand: SocketCommand) {
        const command = this.bot.commands.get(socketCommand.name)!;

        if (!command.options.socketEnabled) {
            // handle error on dashboard-ws.ts
            throw new BotError('Command not enabled for websockets');
        }

        const error = ArgumentParser.validateArguments(command, socketCommand.args);

        if (error) {
            // handle error on dashboard-ws.ts
            throw error;
        }

        try {
            // maybe add a default text channel feature to the bot later
            // which the user can set per command and we would take that channel
            // before using the one the client provided
            // (client will provide the first text channel)
            const textChannel = this.bot.channels.find('id', socketCommand.messageData.channelId) as TextChannel;
            // we pretend the bot wrote the message so stuff like msg.member.voiceChannel will work, because the bot is the member
            const message = new Message(textChannel, {}, this.bot);
            command.execute(message, socketCommand.args);
        } catch (error) {
            console.log(error);
        }
    }
}
