import { Command } from "../interfaces/Command";
import { Message } from "discord.js";
import { CommandOptions } from "../interfaces/CommandOptions";
import { ServerQueueController } from "../core/ServerQueueController";

export class Shuffle implements Command {
    options: CommandOptions = {
        name: 'Shuffle',
        description: 'Shuffles the current queue',
        socketEnabled: true,
        minArguments: 0
    };    
    execute(msg: Message, args: string[]): void {
        const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(msg);
        if(serverEntry.shuffleEnabled) {
            serverEntry.shuffleEnabled = false;
            msg.channel.send('Random play is now `disabled`')
        } else if(serverEntry.isLooping && !serverEntry.shuffleEnabled) {
            serverEntry.isLooping = false;
            serverEntry.shuffleEnabled = true;
            msg.channel.send('Random play is now `enabled`');
            msg.channel.send('Repeating is now `disabled`');
        } else {
            serverEntry.shuffleEnabled = true;
            msg.channel.send('Random play is now `enabled`');
        }
    }


}