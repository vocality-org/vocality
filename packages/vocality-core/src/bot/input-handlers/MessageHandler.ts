import { Command } from '@vocality-org/types';
import { Message } from 'discord.js';
import { BotClient } from '../BotClient';
import { BOT } from '../../config';
import { ArgumentParser } from '../../utils/ArgumentParser';
import { BotError } from '../../BotError';

export class MessageHandler {
  private bot: BotClient;

  constructor(bot: BotClient) {
    this.bot = bot;
    this.addListeners();
  }

  private addListeners() {
    this.bot.on('messageUpdate', (msg: Message) =>
      this.handleMessageUpdate(msg)
    );
    this.bot.on('message', (msg: Message) => this.handleMessage(msg));
  }

  addCustomListener(event: string, callback: Function) {
    this.bot.on(event, callback);
  }

  emitCustomEvent(event: string, ...args: any[]) {
    this.bot.emit(event, args);
  }

  /**
   * Processes every message sent on the server
   */
  handleMessage(message: Message) {
    if (!this.validateMessage(message)) return;

    try {
      if (message.channel.type !== 'dm') {
        this.processMessage(message);
      }
    } catch (e) {
      message.reply(e.message);
    }
  }

  /**
   * Processes edited messages
   */
  private handleMessageUpdate(message: Message): void {
    if (!this.validateMessage(message)) return;

    try {
      this.processMessage(message);
    } catch (e) {
      message.reply(e.message);
    }
  }

  /**
   * Checks that the processed message does not come from a bot user and
   * starts with the correct prefix
   */
  private validateMessage(message: Message): boolean {
    if (message.content.length === 0) return false;
    if (message.guild === null) return true;
    if (message.guild === null && message.author.bot) return false;
    return (
      (!message.author.bot &&
        message.content.startsWith(BOT.SERVERPREFIXES[message.guild.id])) ||
      // if we're not on production we also react to messages from the test bot
      (process.env.NODE_ENV !== 'production' &&
        message.author.username === 'Vocality Tester')
    );
  }

  /**
   * Tries to find and execute a command
   */
  private processMessage(message: Message) {
    const content = message.content.slice(
      message.guild === null ? 0 : BOT.SERVERPREFIXES[message.guild.id].length
    );
    const args = ArgumentParser.parseInput(content);

    let commandtext = args.shift()!.toLowerCase();
    let command = this.getCommandFromName(message.guild!.id, commandtext);

    if (!command) {
      throw new BotError('Command not found');
    }

    while (command.subCommands && args.length > 0) {
      commandtext = args.shift()!.toLocaleLowerCase(); // assume the argument is a subcommand
      const sub = this.getSubCommand(command, commandtext);
      if (sub) {
        command = sub;
      } else {
        args.splice(0, 0, commandtext); // argument was no subcommand so we add it back
      }
    }

    ArgumentParser.validateArguments(command, args);

    command.execute(message, args);
  }

  /**
   * Returns the command if found. Also checks for aliases
   */
  private getCommandFromName(
    guildId: string,
    commandText: string
  ): Command | undefined {
    const found = this.bot.findCommand(guildId, commandText);

    //! if we want to let users select which command to use, start here
    if (!Array.isArray(found)) {
      return found?.command;
    }

    return undefined;
  }

  /**
   * Returns the subcommand if found. Also checks for aliases.
   * This is needed to limit the search to a commands list of subcommands
   */
  private getSubCommand(
    command: Command,
    commandText: string
  ): Command | undefined {
    if (command.subCommands) {
      return command.subCommands.find(
        s =>
          s.options.id.name === commandText ||
          s.options.id.aliases?.includes(commandText)
      );
    }
    return undefined;
  }
}
