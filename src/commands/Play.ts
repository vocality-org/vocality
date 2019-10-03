import { Message, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import { Command } from '../interfaces/Command';
import { QueueContract } from '../interfaces/QueueContract';
import { Song } from '../interfaces/Song';
import { ServerQueueController } from '../core/ServerQueueController';
import isUrl from 'is-url';
import { YouTube } from '../musicAPIs/YouTube';

/**
 *The Play Class is used to Play Music with the Bot
 *
 * @export
 * @class Play
 * @implements {Command}
 */
export class Play implements Command {
    options = {
        name: 'pause',
        description: 'Play a song',
        hasArguments: true,
        socketEnabled: true,
    };

    async execute(msg: Message, args: string[]): Promise<void> {
        if (msg.member.voiceChannel) {
            const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(msg);
            let connection;
            if (args[1] && isUrl(args[0])) {
                let channel = msg.guild.channels.get(args[1]) as VoiceChannel;
                if (channel) {
                    if (channel!.type === 'voice') {
                        connection = await channel.join();
                    } else {
                        msg.channel.send('Channel is not a voice channel');
                        return;
                    }
                } else {
                    msg.channel.send('Channel is not valid');
                    return;
                }
            } else {
                connection = await msg.member.voiceChannel.join();
            }

            serverEntry.connection = connection;
            let url: string;
            if (isUrl(args[0])) {
                url = args[0];
            } else {
                const searchParam: string = args.join('%20');
                const yt = new YouTube();
                const song: Song = await yt.search(searchParam);
                song.requested_by = msg.author.username;
                if (serverEntry.songs.length == 0) {
                    serverEntry.songs.push(song);
                    this.play(msg, serverEntry);
                } else {
                    serverEntry.songs.push(song);
                    msg.channel.send(`${song.title} has been added to the queue!`);
                }
            }
        }
    }

    private play(msg: Message, serverEntry: QueueContract) {
        const song = serverEntry.songs[0];
        if (!song) {
            serverEntry.voiceChannel!.leave();
            serverEntry.songs = [];
            return;
        }
        msg.channel.send(`Now playing ${song.title}`);
        const dispatcher = serverEntry.connection!.playStream(ytdl(song.url, { filter: 'audioonly' })).on('end', () => {
            serverEntry.songs.shift();
            this.play(msg, serverEntry);
        });
    }
}
