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

  handleMessage(message: Message) {
    if (!this.validateMessage(message)) return;

    const content = message.content.slice(
      BOT.SERVERPREFIXES[message.guild.id].length
    );

    try {
      const args = ArgumentParser.parseInput(content);
      const commandtext = args.shift()!.toLowerCase();
      const command = this.getCommandFromMessage(commandtext);
      ArgumentParser.validateArguments(command, args);
      command.execute(message, args);
    } catch (e) {
      message.reply(e.message);
    }
  }

  handleMessageUpdate(msg: Message): void {}

  private validateMessage(message: Message): boolean {
    return (
      (!message.author.bot &&
        message.content.startsWith(BOT.SERVERPREFIXES[message.guild.id])) ||
      (process.env.NODE_ENV !== 'production' &&
        message.author.username === 'Vocality Tester')
    );
  }

  private getCommandFromMessage(commandText: string): Command {
    if (this.bot.commands.has(commandText)) {
      return this.bot.commands.get(commandText)!;
    } else {
      throw new BotError('Unknown Command!');
    }
  }
}
