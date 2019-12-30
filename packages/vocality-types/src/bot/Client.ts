import {
  Client as DiscordClient,
  ClientOptions as DiscordClientOptions,
} from 'discord.js';
import { Plugins } from '../common/Plugin';
import { CommandIdentifier, Command } from './command';

export interface Client extends DiscordClient {
  /**
   * Returns all Commands that match a search string in either name or aliases
   */
  findCommand(guildId: string, search: string): Command | Command[] | undefined;

  /**
   * Adds a custom command. Meaning it is not part of any plugin
   * And will be stored seperately.
   *
   * @param {Command} command
   */
  addCommand(command: Command): void;

  /**
   * Remove a custom command. Only commands stored as custom commands
   * can be removed.
   */
  removeCommand(command: Command | CommandIdentifier): void;

  /**
   * Used to login the Bot with the Discord Token
   */
  init(token?: string): Promise<void>;
}

export interface ClientOptions extends DiscordClientOptions {
  /**
   * List of Plugins to load.
   */
  plugins?: Plugins;

  /**
   * The discord bot token.
   */
  token?: string;
}
