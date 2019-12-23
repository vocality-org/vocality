import { BaseHandler, ArgumentParser, BotError } from '@vocality-org/core';
import { Message, TextChannel } from 'discord.js';
import { SocketCommand } from './../interfaces/SocketCommand';
import { plugin } from '..';

export class SocketCommandHandler extends BaseHandler<SocketCommand> {
  processMessage(socketCommand: SocketCommand) {
    if (!('name' in socketCommand)) {
      throw new BotError('Command must have a name');
    }

    const command = plugin.commands.find(
      c => c.options.id.name === socketCommand.name
    );

    if (!command) {
      throw new BotError('Command not found');
    }

    if (!command.options.socketEnabled) {
      throw new BotError('Command not enabled for websockets');
    }

    try {
      ArgumentParser.validateArguments(command, socketCommand.args);
    } catch (error) {
      throw error;
    }

    try {
      const message = this.createMessage(socketCommand.messageData.guildId);
      command.execute(message, socketCommand.args);
    } catch (error) {
      console.log(error);
    }
  }

  createMessage(guildId: string) {
    const guild = this.bot.guilds.filter(g => g.id === guildId).first();
    const textChannel = guild.channels
      .filter(c => {
        return c.type === 'text';
      })
      .first() as TextChannel;

    const message = new Message(
      textChannel,
      { author: this.bot.user, embeds: [], attachments: [] },
      this.bot
    );
    return message;
  }
}
