import { Message, RichEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';
import { BOT } from '../config';

export class Help implements Command {
  options = {
    name: 'help',
    description: 'Show help',
    hasArguments: false,
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    const embed = new RichEmbed()
      .setTitle('Available Commands')
      .setColor('#00e773')
      .setDescription('All Available Commands are listed below')
      .addBlankField()
      .addField(
        'Commands',
        `\`\`${BOT.SERVERPREFIXES[msg.guild.id]}play <url>\`\` \n \`\`${
          BOT.SERVERPREFIXES[msg.guild.id]
        }skip <number>\`\` \n \`\`${
          BOT.SERVERPREFIXES[msg.guild.id]
        }pause\`\` \n \`\`${
          BOT.SERVERPREFIXES[msg.guild.id]
        }resume\`\` \n \`\`${BOT.SERVERPREFIXES[msg.guild.id]}stop\`\` \n \`\`${
          BOT.SERVERPREFIXES[msg.guild.id]
        }remove <number>\`\``
      );
    msg.channel.send(embed);
  }
}
