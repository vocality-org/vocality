import { BasePlugin, loadCommands } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';
import './dashboard-ws/index';
import * as commandDefs from './commands';
import { ServerQueueController } from './controller/ServerQueueController';

class MusicPlugin extends BasePlugin {
  commands: SocketCommand[];
  private spotifySecret: string | undefined;

  constructor() {
    super();
    this.config.displayName = 'vocality-music';
    this.commands = loadCommands(commandDefs) as SocketCommand[];
  }

  set spotify(secret: string | undefined) {
    this.spotifySecret = secret;
  }

  get spotify(): string | undefined {
    return this.spotifySecret;
  }

  load(guildId: string) {
    ServerQueueController.getInstance().findOrCreateFromGuildId(guildId);
  }

  unload(guildId: string) {
    ServerQueueController.getInstance().remove(guildId);
  }
}

export const music = new MusicPlugin();
