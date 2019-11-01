import { Message, RichEmbed } from 'discord.js';
import { Command } from '../interfaces/Command';
import { BOT } from '../config';
import { bot } from '../bot';

export class Help implements Command {
  options = {
    name: 'help',
    description: 'Show help',
    hasArguments: false,
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    let helpString = ''; 
    bot.commands.forEach(command => {
      helpString += `\`\`${BOT.SERVERPREFIXES[msg.guild.id]}${command.options.name} - ${command.options.description}\`\` \n`;
    })
    const embed = new RichEmbed()
      .setTitle('Available Commands')
      .setColor('#00e773')
      .setDescription('All Available Commands are listed below')
      .addBlankField()
      .addField(
        'Commands',
        helpString
      );
    msg.channel.send(embed);
  }
}
