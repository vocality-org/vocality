import { Command } from "../interfaces/Command";
import { CommandOptions } from "../interfaces/CommandOptions";
import { Message } from "discord.js";
import { ServerQueueController } from "../core/ServerQueueController";

export class Loop implements Command {
    options: CommandOptions = {
        description: 'If set to true it loops the current song',
        name: 'Loop',
        minArguments: 0,
        socketEnabled: true
    };
        execute(msg: Message, args: string[]): void {
        const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(msg);
        if(serverEntry.isLooping){
            serverEntry.isLooping = false;
            msg.channel.send('Repeating is now `disabled`');
        }
        else {
            serverEntry.isLooping = true;
            msg.channel.send('Repeating is now `enabled`');
        }
    }


}