import { BasePlugin } from '@vocality-org/core/build/src/common/BasePlugin';
import * as dotenv from 'dotenv';

dotenv.config();

export class MusicPlugin extends BasePlugin {
  initialize() {
    console.log('music works!');

    return this;
  }

  destroy() {}
}

export const plugin = new MusicPlugin();
