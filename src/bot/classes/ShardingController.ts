import { ShardingManager } from 'discord.js';
import { Bot } from '../config';

export class ShardingController {
  shardingManager: ShardingManager;

  constructor () {
    this.shardingManager = new ShardingManager(__dirname + '/../bot.ts', {
      totalShards: Bot.SHARDS,
      token: Bot.TOKEN
    });
  }

  start () {
    this.shardingManager.spawn();
  }
}

// ? https://github.com/discordjs/guide/tree/master/guide/sharding
