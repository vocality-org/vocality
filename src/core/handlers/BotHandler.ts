import { BotClient } from '../BotClient';

export class BotHandler {
    protected bot: BotClient;

    constructor(bot: BotClient) {
        this.bot = bot;
    }
}
