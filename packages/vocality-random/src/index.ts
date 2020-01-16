import { BasePlugin, loadCommands } from '@vocality-org/core';
import { Command } from '@vocality-org/types';

import * as commandDefs from './commands';
import { RandomDotOrg } from './randomApis/RandomDotOrg';

class RandomPlugin extends BasePlugin {
  protected load(guildId: string): void {
    throw new Error('Method not implemented.');
  }
  protected unload(guildId: string): void {
    throw new Error('Method not implemented.');
  }
  commands: Command[];
  randomDotOrgClient = new RandomDotOrg();

  constructor() {
    super();
    this.config.displayName = 'vocality-random';
    this.commands = loadCommands(commandDefs);
  }

  set randomOrgApiKey(secret: string) {
    this.randomDotOrgClient.key = secret;
  }
}

export const random = new RandomPlugin();
