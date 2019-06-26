import {
  Message,
  ReactionCollector,
  MessageReaction,
  RichEmbed
} from "discord.js";
import { BotClient } from "./BotClient";
import { ArgumentParser } from "./ArgumentParser";
import { BotError } from "./BotError";
import { config } from "../config";
import { ServerQueue } from "./ServerQueue";
import { QueueContract } from "../interfaces/QueueContract";

export class MessageHandler {
  bot: BotClient;
  serverQueue: ServerQueue;

  constructor(bot: BotClient) {
    this.bot = bot;
    this.serverQueue = new ServerQueue();
    this.addListeners();
  }

  addListeners() {
    this.bot.on("message", msg => this.onMessage(msg));
    this.bot.on("messageUpdate", msg => this.onMessageUpdate(msg));
  }

  onMessage(message: Message) {
    this.checkForLyricsReactions(message);

    if (!this.validateMessage(message)) return;

    const content = message.content.slice(
      config.SERVERPREFIXES[message.guild.id].length
    );
    const args = ArgumentParser.parse(content);

    if (args instanceof BotError) {
      message.reply(args.errorMessage);
    } else {
      const command = args.shift()!.toLowerCase();

      if (!this.bot.commands.has(command)) {
        message.reply("Unknown command!");
      }

      try {
        let serverEntry: QueueContract | undefined = undefined;
        if (
          command === "play" ||
          command === "skip" ||
          command === "stop" ||
          command === "current" ||
          command === "pause" ||
          command === "resume" ||
          command === "lyrics"
        ) {
          if (this.serverQueue.find(message.guild.id)) {
            serverEntry = this.serverQueue.find(message.guild.id)!;
          } else {
            serverEntry = {
              connection: null,
              songs: [],
              textChannel: message.channel,
              voiceChannel: message.member.voiceChannel,
              lyricsFragments: [],
              page: 1
            };
            this.serverQueue.add(message.guild.id, serverEntry);
          }
        }
        this.bot.commands.get(command)!.execute(message, args, serverEntry);
      } catch (error) {
        console.log(error);
      }
    }
  }

  onMessageUpdate(msg: Message): void {}

  private validateMessage(message: Message): boolean {
    return (
      !message.author.bot &&
      message.content.startsWith(config.SERVERPREFIXES[message.guild.id])
    );
  }
  private checkForLyricsReactions(message: Message) {
    if (message.embeds.length != 0) {
      if (
        message.embeds[0].title.includes("Lyrics") &&
        message.author.id === this.bot.user.id
      ) {
        const serverEntry = this.serverQueue.find(message.guild.id);
        if (serverEntry!.lyricsFragments.length > 1) {
          message.react("◀").then(() => message.react("▶"));
          const filter = (reaction: MessageReaction) => {
            return ["◀", "▶"].includes(reaction.emoji.name);
          };
          let collector = message.createReactionCollector(filter, {
            time: serverEntry!.songs[0].length_ms
          });
          collector.on("collect", (reaction, collector) => {
            if (reaction.users.size > 1) {
              const embed = new RichEmbed()
                .setTitle(message.embeds[0].title)
                .setURL(message.embeds[0].url)
                .setColor(message.embeds[0].color);
              if (reaction.emoji.name === "◀") {
                if (serverEntry!.page != 1) {
                  serverEntry!.page -= 1;
                  embed.setDescription(
                    serverEntry!.lyricsFragments[serverEntry!.page - 1]
                  );
                } else {
                  embed.setDescription(
                    serverEntry!.lyricsFragments[serverEntry!.page - 1]
                  );
                  message.channel.send("Cant go further back");
                }
              } else if (reaction.emoji.name === "▶") {
                if (serverEntry!.page !== serverEntry!.lyricsFragments.length) {
                  serverEntry!.page += 1;
                  embed.setDescription(
                    serverEntry!.lyricsFragments[serverEntry!.page - 1]
                  );
                } else {
                  embed.setDescription(
                    serverEntry!.lyricsFragments[serverEntry!.page - 1]
                  );
                  message.channel.send("Cant go further forward");
                }
              }
              reaction.remove(reaction.users.lastKey());
              embed.setFooter(
                `Page ${serverEntry!.page} of ${
                  serverEntry!.lyricsFragments.length
                }`
              );
              message.edit(embed);
            }
          });
        }
      }
    }
  }
}
