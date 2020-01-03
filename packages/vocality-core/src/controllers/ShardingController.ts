import { ShardingManager } from 'discord.js';
import { BOT } from '../config';
import * as path from 'path';

export class ShardingController {
  shardingManager: ShardingManager;

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.shardingManager = new ShardingManager(
        path.join(__dirname, '..', 'bot.js'),
        {
          totalShards: BOT.SHARDS,
          token: process.env.BOT_TOKEN,
        }
      );
    } else {
      this.shardingManager = new ShardingManager(
        path.join(__dirname, '..', 'bot.ts'),
        {
          totalShards: BOT.SHARDS,
          token: process.env.BOT_TOKEN,
        }
      );
    }
  }

  start() {
    this.shardingManager.spawn();
  }
}
