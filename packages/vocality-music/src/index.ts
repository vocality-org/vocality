import { BasePlugin } from '@vocality-org/core';

export class MusicPlugin extends BasePlugin {
  initialize() {
    console.log('music works!');

    return this;
  }

  destroy() {}
}

export const plugin = new MusicPlugin();
