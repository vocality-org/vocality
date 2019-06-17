import { Message, RichEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';
import { config } from '../config';

export class Help implements Command {
  execute(msg: Message, args: string[]): void {
    const embed = new RichEmbed()
      .setTitle('Available Commands')
      .setColor('#00e773')
      .setDescription('All Available Commands are listed below')
      .addBlankField()
      .addField(
        'Commands',
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
