import {
  Client as DiscordClient,
  ClientOptions as DiscordClientOptions,
} from 'discord.js';
import { Plugins } from '../common/Plugin';
import { Command } from './command/Command';

export interface Client extends DiscordClient {
  /**
   * Amount of milliseconds from UNIX epoch, when the bot was started
   */
  readonly initTime: number;

  /**
   * Returns all Commands that match a search string in either name or aliases
   */
  findCommand(guildId: string, search: string): Command | Command[] | undefined;

  /**
   * Used to login the Bot with the Discord Token
   */
  init(): Promise<void>;
}

export interface ClientOptions extends DiscordClientOptions {
  /**
   * List of Plugins to load.
   * @default DEFAULT_PLUGINS
   */
  plugins?: Plugins;
}
