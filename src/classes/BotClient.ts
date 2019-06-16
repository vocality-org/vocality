import { Client as DiscordClient, ClientOptions } from 'discord.js';
import { config } from '../config';

export class BotClient extends DiscordClient {
    initTime: number;

    constructor(options?: ClientOptions | undefined) {
        super(options);
        this.initTime = Date.now();

        this.once('ready', () => {
            this.user.setActivity(`${config.PREFIX}help`);
        });
    }

    async init() {
        await this.login(config.TOKEN);
    }
}