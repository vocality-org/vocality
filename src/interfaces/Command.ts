import { Message } from "discord.js";

export interface Command {
  execute(msg: Message, args: string[]): void;
}
