import { Message, RichEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';
import { Bot } from '../config';

export class Help implements Command {
  execute(msg: Message, args: string[]): void {
    const embed = new RichEmbed()
      .setTitle('Available Commands')
      .setColor('#00e773')
      .setDescription('All Available Commands are listed below')
      .addBlankField()
      .addField(
        'Commands',
        `\`\`${Bot.SERVERPREFIXES[msg.guild.id]}play <url>\`\` \n \`\`${
        Bot.SERVERPREFIXES[msg.guild.id]
        }skip <number>\`\` \n \`\`${
        Bot.SERVERPREFIXES[msg.guild.id]
        }pause\`\` \n \`\`${
        Bot.SERVERPREFIXES[msg.guild.id]
        }resume\`\` \n \`\`${
        Bot.SERVERPREFIXES[msg.guild.id]
        }stop\`\` \n \`\`${
        Bot.SERVERPREFIXES[msg.guild.id]
        }remove <number>\`\``
      );
    msg.channel.send(embed);
  }
}
