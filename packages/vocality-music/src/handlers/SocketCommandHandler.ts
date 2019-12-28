import { ArgumentParser, BotError } from '@vocality-org/core';
import { SocketCommandMessage } from '../types/SocketCommand';
import { plugin } from '..';

export class SocketCommandHandler {
  processMessage(socketCommand: SocketCommandMessage) {
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

    command.run(socketCommand.args, socketCommand.messageData.guildId);
  }
}
