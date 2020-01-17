import {
  Command,
  CommandOptions,
  CommandSearchResult,
  CommandType,
} from '@vocality-org/types';
import { Message, RichEmbed } from 'discord.js';
import { BotClient } from '../bot/BotClient';
import { COLOR, BOT, EMOJI } from '../config';

export class Help implements Command {
  options: CommandOptions = {
    id: {
      name: 'help',
      aliases: ['h'],
    },
    usage: 'help (command)',
    description: 'Shows command information',
  };

  execute(msg: Message, args: string[]) {
    const emptySearch = args.length === 0;
    let commands: CommandSearchResult[];

    if (emptySearch) {
      commands = BotClient.instance().getAllCommands(msg.guild.id);
    } else {
      const found = BotClient.instance().findCommand(msg.guild.id, args[0]);

      if (!found) {
        msg.reply('Not found');
        return;
      }
      commands = Array.isArray(found) ? found : [found];
    }

    if (emptySearch) {
      for (let i = 0; commands.length > 0; i += 24) {
        const embed = this.buildMultiCommandEmbed(
          msg.guild.id,
          commands.splice(i, i + 24)
        );

        msg.channel.send(embed);
      }
    } else {
      commands.forEach(result => {
        const embed = this.buildSingleCommandEmbed(msg.guild.id, result);
        msg.channel.send(embed);
      });
    }
  }

  private buildMultiCommandEmbed(
    guildId: string,
    results: CommandSearchResult[]
  ): RichEmbed {
    const embed = new RichEmbed().setColor(COLOR.CYAN);

    embed.setTitle(`Found ${results.length} Commands`);

    embed.setDescription(
      `Commands are listed below. Use \`${BOT.SERVERPREFIXES[guildId]}${this.options.usage}\` to get more details.`
    );

    results.forEach(r => {
      const commandTypeString =
        r.type === CommandType.CoreCommand
          ? 'core'
          : r.type === CommandType.CustomCommand
          ? 'custom'
          : `plugin: ${r.plugin?.config.displayName}`;

      embed.addField(
        `${r.command.options.id.name} (${commandTypeString})`,
        `${r.command.options.description || '*no description*'}\n\`${
          BOT.SERVERPREFIXES[guildId]
        }${r.command.options.usage || r.command.options.id.name}\``
      );
    });

    return embed;
  }

  private buildSingleCommandEmbed(
    guildId: string,
    result: CommandSearchResult
  ): RichEmbed {
    const embed = new RichEmbed().setColor(COLOR.CYAN);

    embed.setTitle(result.command.options.id.name);
    embed.setDescription(result.command.options.description);

    embed.addField(
      'Usage',
      `\`${BOT.SERVERPREFIXES[guildId]}${result.command.options.usage}\``,
      true
    );

    if (result.type === CommandType.PluginCommand) {
      embed.addField('Plugin', result.plugin?.config.displayName, true);
    }

    embed.addBlankField();

    if (result.command.subCommands) {
      embed.addField(
        'Sub Commands',
        result.command.subCommands
          .map(s => `${EMOJI.LIST_ITEM_POINT} ${s.options.id.name}`)
          .join('\n'),
        true
      );
    }

    if (result.command.options.id.aliases) {
      embed.addField(
        'Aliases',
        result.command.options.id.aliases
          .map(a => `${EMOJI.LIST_ITEM_POINT} ${a}`)
          .join('\n'),
        true
      );
    }

    return embed;
  }
}
