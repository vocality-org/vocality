import { ArgumentParser, BotError } from '@vocality-org/core';
import { SocketCommandMessage } from '../types/SocketCommand';
import music from '..';

export class SocketCommandHandler {
  processMessage(socketCommand: SocketCommandMessage) {
    if (!('name' in socketCommand)) {
      throw new BotError('Command must have a name');
    }

    const command = music.commands.find(
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
      command.run(socketCommand.args, socketCommand.messageData.guildId);
    } catch (error) {
      throw error;
    }
  }
}
