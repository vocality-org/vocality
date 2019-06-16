import { Command } from "../classes/Command";
import { Message, RichEmbed } from "discord.js";
import { config } from "../config";
import { BotClient } from "../classes/BotClient";

export class Help extends Command {
  execute(msg: Message, bot: BotClient): void {
    const embed = new RichEmbed()
      .setTitle("Available Commands")
      .setColor("#00e773")
      .setDescription("All Available Commands are listed below")
      .addBlankField()
      .addField(
        "Commands",
        `\`\`${config.SERVERPREFIXES[msg.guild.id]}play <url>\`\` \n \`\`${
          config.SERVERPREFIXES[msg.guild.id]
        }skip <number>\`\` \n \`\`${
          config.SERVERPREFIXES[msg.guild.id]
        }pause\`\` \n \`\`${
          config.SERVERPREFIXES[msg.guild.id]
        }resume\`\` \n \`\`${
          config.SERVERPREFIXES[msg.guild.id]
        }stop\`\` \n \`\`${
          config.SERVERPREFIXES[msg.guild.id]
        }remove <number>\`\``
      );
    msg.channel.send(embed);
  }
}
