import { BasePlugin, loadCommands } from '@vocality-org/core';
import { SocketCommand } from './types/SocketCommand';
import './dashboard-ws/index';
import * as commandDefs from './commands';
import { ServerQueueController } from './controller/ServerQueueController';

class MusicPlugin extends BasePlugin {
  commands: SocketCommand[];
  private spotifySecret: string | undefined;
  private geniusSecret: string | undefined;
  private spotifyClientId: string | undefined;
  private spotifyAccessToken: string | undefined;

  constructor() {
    super();
    this.config.displayName = 'vocality-music';
    this.commands = loadCommands(commandDefs) as SocketCommand[];
  }

  set spotify_secret(secret: string | undefined) {
    this.spotifySecret = secret;
  }

  get spotify_secret(): string | undefined {
    return this.spotifySecret;
  }
  set spotify_access_token(accessToken: string | undefined) {
    this.spotifyAccessToken = accessToken;
  }

  get spotify_access_token(): string | undefined {
    return this.spotifyAccessToken;
  }
  set spotify_client_id(clientId: string | undefined) {
    this.spotifyClientId = clientId;
  }
  get spotify_client_id() {
    return this.spotifyClientId;
  }
  set genius(secret: string | undefined) {
    this.geniusSecret = secret;
  }

  get genius(): string | undefined {
    return this.geniusSecret;
  }

  load(guildId: string) {
    ServerQueueController.getInstance().findOrCreateFromGuildId(guildId);
  }

  unload(guildId: string) {
    ServerQueueController.getInstance().remove(guildId);
  }
}

export const music = new MusicPlugin();
