import {
  Client as DiscordClient,
  ClientOptions as DiscordClientOptions,
} from 'discord.js';
import { Plugin } from '../common/Plugin';
import { Command, CommandType } from './command';

export interface Client extends DiscordClient {
  opts: ClientOptions | undefined;

  /**
   * Returns all Commands loaded. This contains core, custom and plugin
   * commands.
   */
  getAllCommands(guildId: string): CommandSearchResult[];

  /**
   * Returns all Commands that match a search string in either name or aliases.
   *
   * @returns The returned Object contains the command instance, a command type of
   * `CommandType` and the optional plugin the command is stored in.
   *
   * If no command was found the value is undefined.
   */
  findCommand(
    guildId: string,
    search: string
  ): CommandSearchResult | CommandSearchResult[] | undefined;

  /**
   * Adds a custom command. Meaning it is not part of any plugin
   * And will be stored seperately.
   *
   * @param {Command} command
   */
  addCommand(command: Command): void;

  /**
   * Remove a custom command. Only commands stored as custom commands
   * can be removed. If multiple commands are found all will be removed.
   *
   * @param {(Command | string)} command Command instance or name
   */
  removeCommand(command: Command | string): void;

  /**
   * Load a  plugins for all guilds
   *
   * @param {boolean} loaded True if the plugins should be loaded
   */
  addPlugin(plugin: Plugin, loaded: boolean): void;

  /**
   * Used to login the Bot with the Discord Token
   */
  init(token?: string): Promise<void>;
}

export interface ClientOptions extends DiscordClientOptions {
  /**
   * List of Plugins to load.
   */
  plugins?: Plugin[];

  /**
   * The discord bot token.
   */
  token?: string;
}

/**
 * Result of a command search. Contains the found command and optionally the plugin
 * it is contained in.
 */
export interface CommandSearchResult {
  command: Command;
  type: CommandType;
  plugin?: Plugin;
}
