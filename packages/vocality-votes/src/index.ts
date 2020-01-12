import { BasePlugin, loadCommands } from '@vocality-org/core';
import { Command } from '@vocality-org/types';
import * as commandDefs from './commands';
import { ServerQueueController } from './controller/ServerQueueController';

class VotesPlugin extends BasePlugin {
  commands: Command[];

  constructor() {
    super();
    this.commands = loadCommands(commandDefs) as Command[];
  }

  load(guildId: string) {
    ServerQueueController.getInstance().findOrCreateFromGuildId(guildId);
  }

  unload(guildId: string) {
    ServerQueueController.getInstance().remove(guildId);
  }
}
export const votesPlugin = new VotesPlugin();
