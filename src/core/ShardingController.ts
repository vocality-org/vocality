import { ShardingManager } from 'discord.js';
import { Bot } from '../config';
import path from 'path'

export class ShardingController {
    shardingManager: ShardingManager;

    constructor() {
        if(process.env.PRODUCTION) {
            this.shardingManager = new ShardingManager(path.join(__dirname, '..', 'bot.js'), {
                totalShards: Bot.SHARDS,
                token: Bot.TOKEN,
            });
        } else {
            this.shardingManager = new ShardingManager(path.join(__dirname, '..', 'bot.ts'), {
                totalShards: Bot.SHARDS,
                token: Bot.TOKEN,
            });
        }
        
    }

    start() {
        this.shardingManager.spawn();
    }
}

// ? https://github.com/discordjs/guide/tree/master/guide/sharding
