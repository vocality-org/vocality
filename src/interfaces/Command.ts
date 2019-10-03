import { Message } from 'discord.js';
import { CommandOptions } from './CommandOptions';

export interface Command {
    options: CommandOptions;
    execute(msg: Message, args: string[]): void;
}
