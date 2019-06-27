import { Message } from "discord.js";
import { QueueContract } from "./QueueContract";
import { ServerQueueController } from "../classes/ServerQueueController";

export interface Command {
  execute(msg: Message, args: string[], serverQueue?: QueueContract): void;
}
