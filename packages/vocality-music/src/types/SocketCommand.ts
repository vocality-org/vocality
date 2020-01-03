import { CommandOptions, Command } from '@vocality-org/types';
import { Message } from 'discord.js';

export interface SocketCommandMessage {
  name: string;
  args: string[];
  messageData: any;
}

export interface SocketCommand extends Command {
  options: SocketCommandOptions;

  run(args: string[], guildId: string, msg?: Message): void;
}

export interface SocketCommandOptions extends CommandOptions {
  /**
   * If set to true the command can be executed from a websocket connection
   */
  socketEnabled?: boolean;
}
