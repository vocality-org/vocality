import { Command } from "../interfaces/Command";
import { CommandOptions } from "../interfaces/CommandOptions";
import { Message } from "discord.js";
import { ServerQueueController } from "../core/ServerQueueController";
import { onVolumeChange } from "../dashboard-ws";

export class Volume implements Command {
    options: CommandOptions = {
        minArguments: 1,
        name: 'volume',
        description: 'change the Volume of the bot (0-100)',
        socketEnabled: true
    };    
    execute(msg: Message, args: string[]): void {
        if(isNaN(+args[0])) {
            msg.reply('Volume is not a number');
            return;
        }
        const serverEntry = ServerQueueController.getInstance().find(msg.guild.id)!;
        const vol = Number.parseFloat(args[0]);
        serverEntry.volume = vol / 100;
        if(serverEntry.connection) {
            serverEntry.connection!.dispatcher.setVolume(vol / 100);
        }
        msg.reply(`Volume changed to ${vol}`);
        onVolumeChange(vol);
    }


}