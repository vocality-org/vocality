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
      let commandtext = args.shift()!.toLowerCase();
      let command = this.getCommandFromMessage(commandtext)!;

      // get deepest sub command
      while (command.options.subCommands && commandtext) {
        commandtext = args.shift()!.toLocaleLowerCase();
        const sub = this.getCommandFromMessage(commandtext);
        if (sub) {
          command = sub;
        }
      }

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

  private getCommandFromMessage(commandText: string): Command | undefined {
    if (this.bot.commands.has(commandText)) {
      return this.bot.commands.get(commandText);
    } else {
      throw new BotError('Unknown Command!');
    }
  }
}
