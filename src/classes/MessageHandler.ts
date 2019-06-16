import { Message } from "discord.js";
import { BotClient } from "./BotClient";
import { ArgumentParser } from "./ArgumentParser";
import { BotError } from "./BotError";
import { Command } from "./Command";

export class MessageHandler {
  bot: BotClient;

  constructor(bot: BotClient) {
    this.bot = bot;
    this.addListeners();
  }

  addListeners() {
    this.bot.on("message", msg => this.onMessage(msg));
    this.bot.on("messageUpdate", msg => this.onMessageUpdate(msg));
    this.bot.on("raw", (msg: any) => this.onRaw(msg));
  }

  onMessage(message: Message) {
    const argumentParser: ArgumentParser = new ArgumentParser();
    const command: Command | BotError | undefined = argumentParser.buildCommand(
      message
    );
    if (command instanceof BotError) {
      message.reply(command.errorMessage);
    }
    if (command instanceof Command) {
      command.execute(message, this.bot);
    }
  }

  onMessageUpdate(msg: Message) {}

  onRaw(msg: any) {
    //? https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
  }
}
