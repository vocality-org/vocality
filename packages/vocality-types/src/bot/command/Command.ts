import { Message } from 'discord.js';
import { CommandOptions } from './CommandOptions';

export interface Command {
  options: CommandOptions;
  subCommands?: Command[];

  execute(msg: Message, args: string[]): void;
}
