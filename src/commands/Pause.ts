import { Command } from "../interfaces/Command";
import { Message } from "discord.js";
import { ServerQueueController } from "../classes/ServerQueueController";

export class Pause implements Command {
  execute(msg: Message, args: string[]): void {
    if (ServerQueueController.getInstance().find(msg.guild.id) === undefined)
      return;

    const connection = ServerQueueController.getInstance().find(msg.guild.id)!
      .connection;
    connection!.dispatcher.pause();
  }
}
