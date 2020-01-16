import { Command, CommandOptions } from '@vocality-org/types';
import { Message } from 'discord.js';
import { BotClient } from '../../bot/BotClient';

export class Load implements Command {
  options: CommandOptions = {
    id: {
      name: 'load',
    },
    usage: 'load [plugin-name]',
    description: 'Loads a plugin if it was unloaded',
    minArguments: 1,
  };

  execute(msg: Message, args: string[]) {
    const plugins = BotClient.instance().pluginController.getGuildPlugins(
      msg.guild.id
    );

    const found = plugins.find(p => p.config.displayName === args[0]);

    if (!found) {
      msg.reply(`Could not find plugin \`${args[0]}\``);
      return;
    }

    if (found.config.loaded) {
      msg.reply(`Plugin already loaded`);
      return;
    }

    BotClient.instance().pluginController.load(msg.guild.id, found);
  }
}
