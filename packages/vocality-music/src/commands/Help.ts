import { Message } from 'discord.js';
import { Command, CommandOptions } from '../../../vocality-types/build/src';

export class Help implements Command {
  options: CommandOptions = {
    id: {
      name: 'help',
      aliases: ['h'],
    },
    displayName: 'help',
    description: 'Show help',
    socketEnabled: false,
  };

  execute(msg: Message, args: string[]): void {
    // const embed = new RichEmbed().setColor(COLOR.CYAN);
    /*if (args[0]) {
      const command = bot.findCommand(args[0]);

      if (!command) {
        msg.reply('Not found');
        return;
      }

      embed.setTitle(command.options.id.name);
      embed.setDescription(command.options.description);

      embed.addBlankField();

      embed.addField(
        'Aliases',
        command.options.id.aliases?.map(a => `• ${a}`).join('\n') + '\n',
        true
      );

      embed.addBlankField(true);

      embed.addField(
        'Usage',
        `\`${BOT.SERVERPREFIXES[msg.guild.id]}${command.options.displayName}\``,
        true
      );

      msg.channel.send(embed);
    } else {
      embed.setTitle('Available Commands');
      embed.setDescription(
        `All Commands are listed below. Use \`${
          BOT.SERVERPREFIXES[msg.guild.id]
        } help [command]\` to see more details on a single command`
      );

      // Discord limits fields in embeds to 25
      let embedCount = 0;

      const fieldBuffer = new Array<{
        name: string;
        value: string;
        inline?: boolean;
      }>();

      bot.commands.forEach(command => {
        fieldBuffer.push({
          name: command.options.id.name,
          value: `${command.options.description}\n\`${
            BOT.SERVERPREFIXES[msg.guild.id]
          }${command.options.displayName}\``,
        });
      });

      while (fieldBuffer.length > 0) {
        fieldBuffer.splice(embedCount * 25, 25).forEach(field => {
          embed.addField(field.name, field.value, field.inline);
        });
        msg.channel.send(embed);
        embed.fields = [];
        embedCount++;
      }
    }*/
  }
}
