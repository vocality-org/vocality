import { Command, CommandOptions } from '@vocality-org/types';
import { Message, MessageEmbed } from 'discord.js';
import { BotClient } from '../bot/BotClient';
import { loadCommands } from '../utils/loadCommands';
import { COLOR, EMOJI } from '../config';

import * as pluginCommands from './plugin-commands';

export class Plugin implements Command {
  options: CommandOptions = {
    id: {
      name: 'plugins',
      aliases: ['plugin'],
    },
    usage: 'plugins',
    description: 'List all plugins. Load and unload plugins with sub commands',
  };

  subCommands = loadCommands(pluginCommands);

  execute(msg: Message, args: string[]) {
    const plugins = BotClient.instance().pluginController.getGuildPlugins(
      msg.guild!.id
    );

    const description = plugins
      .sort((a, b) => {
        // loaded plugins first
        return a.config.loaded === b.config.loaded
          ? 0
          : a.config.loaded
          ? -1
          : 1;
      })
      .map(p => {
        return `${p.config.loaded ? EMOJI.WHITE_CHECK_MARK : EMOJI.RED_X} - ${p
          .config.displayName || '[not-named]'}`;
      })
      .join('\n');

    const embed = new MessageEmbed()
      .setTitle(`Found ${plugins.length} Plugins`)
      .setColor(COLOR.CYAN)
      .setDescription(description);

    msg.channel.send({ embed });
  }
}
