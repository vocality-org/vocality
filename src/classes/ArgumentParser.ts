import { Message } from "discord.js";
import { config } from "../config";
import { BotError } from "./BotError";
import { Command } from "./Command";
import { Help } from "../commands/Help";
import { ChangePrefix } from "../commands/ChangePrefix";
import { Play } from "../commands/Play";
import { BotClient } from "./BotClient";
import { Stop } from "../commands/Stop";

export class ArgumentParser {
  buildCommand(msg: Message): Command | BotError | undefined {
    if (msg.content.startsWith(config.SERVERPREFIXES[msg.guild.id])) {
      var commands: string[] = msg.content.substring(1).split(" ");
      switch (commands[0].toLowerCase()) {
        case "pause":
          break;
        case "play":
          return new Play(commands.splice(1, commands.length));
          break;
        case "remove":
          break;
        case "skip":
          break;
        case "stop":
          return new Stop(commands.splice(1, commands.length));
          break;
        case "resume":
          break;
        case "help":
          return new Help([]);
          break;
        case "changeprefix":
          return new ChangePrefix(commands.splice(1, commands.length));
          break;
        default:
          return new BotError("Unknown Command");
          break;
      }
    } else {
      return undefined;
    }
  }
}
