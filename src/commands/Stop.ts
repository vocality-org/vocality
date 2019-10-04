import { Message } from 'discord.js';
import { Command } from '../interfaces/Command';
import { ServerQueueController } from '../core/ServerQueueController';

export class Stop implements Command {
    options = {
        name: 'stop',
        description: 'Stop the bot',
        hasArguments: false,
        socketEnabled: true,
    };

    execute(msg: Message, args: string[]): void {
        const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;

        if (serverEntry.songs.length === 0) return;
        if (msg.member.voiceChannel) {
            serverEntry.songs = [];
            msg.member.voiceChannel.leave();
        }
    }
}
