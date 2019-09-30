import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';
import { Bot } from '../config';
import { CommandOptions } from '../interfaces/CommandOptions';

export class ChangePrefix implements Command {
    options: CommandOptions = {
        name: 'changePrefix',
        description: 'Change the bots prefix',
        hasArguments: true,
    };

    execute(msg: Message, args: string[]): void {
        Bot.SERVERPREFIXES[msg.guild.id] = args[0];
        msg.channel.send(`Prefix changed to \`${Bot.SERVERPREFIXES[msg.guild.id]}\``);
    }
}
