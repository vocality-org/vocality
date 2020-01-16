import { BasePlugin, loadCommands } from '@vocality-org/core';
import { Command } from '@vocality-org/types';

import * as commandDefs from './commands';
import { RandomDotOrg } from './randomApis/RandomDotOrg';

class RandomPlugin extends BasePlugin {
  commands: Command[];
  randomDotOrgClient = new RandomDotOrg();

  constructor() {
    super();
    this.config.displayName = 'vocality-random';
    this.commands = loadCommands(commandDefs);
  }

  set randomDotOrg(secret: string) {
    this.randomDotOrgClient.key = secret;
  }
}

export const random = new RandomPlugin();
