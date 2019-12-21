import { Client as DiscordClient, Collection } from 'discord.js';
import { Command } from './command/Command';

export interface Client extends DiscordClient {
  /**
   * Amount of milliseconds from UNIX epoch, when the bot was started
   */
  initTime: number;

  /**
   * Collection of all loaded commands
   */
  commands: Collection<string, Command>;

  /**
   * Provides a utility to for semantic command search. Returns first command
   * that has a match in either name or aliases
   */
  findCommand(search: string): Command | undefined;

  /**
   * Used to login the Bot with the Discord Token
   */
  init(): Promise<void>;
}
