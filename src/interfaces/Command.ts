import { Message } from "discord.js";
import { QueueContract } from "./QueueContract";
import { ServerQueue } from "../classes/ServerQueue";

export interface Command {
  execute(msg: Message, args: string[], serverEntry?: QueueContract): void;
}
