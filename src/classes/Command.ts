import { Message } from "discord.js";
import { BotClient } from "./BotClient";

export abstract class Command {
  arguments: string[];

  constructor(args: string[]) {
    this.arguments = args;
  }

  abstract execute(msg: Message, bot: BotClient): void;
}
