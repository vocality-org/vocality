import { ShardingManager } from 'discord.js';
import { config } from '../config';

export class ShardingController {
  shardingManager: ShardingManager;

  constructor () {
    this.shardingManager = new ShardingManager(__dirname + '/../bot.ts', {
      totalShards: config.SHARDS,
      token: config.TOKEN
    });
  }

  start () {
    this.shardingManager.spawn();
  }
}

// ? https://github.com/discordjs/guide/tree/master/guide/sharding
