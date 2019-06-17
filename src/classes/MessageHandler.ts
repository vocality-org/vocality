import { Message } from "discord.js";
import { BotClient } from "./BotClient";
import { ArgumentParser } from "./ArgumentParser";
import { BotError } from "./BotError";
import { config } from "../config";

export class MessageHandler {
  bot: BotClient;

  constructor(bot: BotClient) {
    this.bot = bot;
    this.addListeners();
  }

  addListeners() {
    this.bot.on("message", msg => this.onMessage(msg));
    this.bot.on("messageUpdate", msg => this.onMessageUpdate(msg));
  }

  onMessage(message: Message) {
    if (!this.validateMessage(message)) return;

    const content = message.content.slice(config.SERVERPREFIXES[message.guild.id].length);
    const args = ArgumentParser.parse(content);

    if (args instanceof BotError) {
      message.reply(args.errorMessage);
    } else {
      const command = args.shift()!.toLowerCase();
      
      if (!this.bot.commands.has(command)) {
        message.reply("Unknown command!");
      }

      try {
        this.bot.commands.get(command)!.execute(message, args);
      } catch (error) {
        console.log(error);
      }
    }
  }

  onMessageUpdate(msg: Message): void { }

  private validateMessage(message: Message): boolean {
    return (
      !message.author.bot &&
      message.content.startsWith(config.SERVERPREFIXES[message.guild.id])
    );
  }
}
