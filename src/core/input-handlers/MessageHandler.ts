import { BotHandler } from './BotHandler';
import { Message } from 'discord.js';
import { BotClient } from '../BotClient';
import { BOT } from '../../config';
import { ArgumentParser } from '../ArgumentParser';
import { BotError } from '../BotError';
import { Command } from '../../interfaces/Command';

export class MessageHandler extends BotHandler {
  constructor(bot: BotClient) {
    super(bot);
    this.addListeners();
  }

  addListeners() {
    this.bot.on('message', msg => this.handleMessage(msg));
    this.bot.on('messageUpdate', msg => this.handleMessageUpdate(msg));
  }

  /**
   * Processes every message sent on the server
   */
  handleMessage(message: Message) {
    if (!this.validateMessage(message)) return;

    const content = message.content.slice(
      BOT.SERVERPREFIXES[message.guild.id].length
    );

    try {
      const args = ArgumentParser.parseInput(content);
      let commandtext = args.shift()!.toLowerCase();
      let command = this.getCommandFromName(commandtext)!;

      // get subcommands
      while (command.subCommands && args.length > 0) {
        commandtext = args.shift()!.toLocaleLowerCase();
        const sub = this.getSubCommand(command, commandtext);
        if (sub) {
          command = sub;
        } else {
          args.splice(0, 0, commandtext); // argument was no subcommand so we add it back
        }
      }

      ArgumentParser.validateArguments(command, args);

      command.execute(message, args);
    } catch (e) {
      message.reply(e.message);
    }
  }

  /**
   * Processes updated messages
   */
  handleMessageUpdate(msg: Message): void {}

  private validateMessage(message: Message): boolean {
    return (
      (!message.author.bot &&
        message.content.startsWith(BOT.SERVERPREFIXES[message.guild.id])) ||
      (process.env.NODE_ENV !== 'production' &&
        message.author.username === 'Vocality Tester')
    );
  }

  /**
   * Returns the command if found. Also checks for aliases
   */
  private getCommandFromName(commandText: string): Command | undefined {
    if (this.bot.commands.has(commandText)) {
      // get key / command name via CommandIdentifier from options
      const key = this.bot.commands.findKey(c => {
        if (c.options.id.aliases) {
          return (
            c.options.id.name === commandText ||
            c.options.id.aliases?.includes(commandText)
          );
        } else {
          return c.options.id.name === commandText;
        }
      });

      return this.bot.commands.get(key);
    } else {
      throw undefined;
    }
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
