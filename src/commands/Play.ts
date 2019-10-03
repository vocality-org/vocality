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
        if (msg.member.voiceChannel || msg.member.user.bot) {
            const serverEntry = ServerQueueController.getInstance().findOrCreateFromMessage(msg);
            let connection = null;

            if (msg.member.voiceChannel) {
                connection = await msg.member.voiceChannel.join();
            } else if (msg.member.user.bot) {
                const voiceChannel = msg.guild.channels.filter(g => g.type === 'voice').first() as VoiceChannel;
                connection = await voiceChannel.join();
                console.log(connection);
            }

            serverEntry.connection = connection;
            let url: string;
            if (isUrl(args[0])) {
                url = args[0];
                this.play;
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
        } else {
            msg.channel.send('Please join a voice channel');
        }
    }

    private play(msg: Message, serverEntry: QueueContract) {
        const song = serverEntry.songs[0];
        console.log(serverEntry);

        if (!song) {
            serverEntry.voiceChannel!.leave();
            serverEntry.songs = [];
            return;
        }
        console.log(song);

        msg.channel.send(`Now playing ${song.title}`);
        const dispatcher = serverEntry.connection!.playStream(ytdl(song.url, { filter: 'audioonly' })).on('end', () => {
            serverEntry.songs.shift();
            this.play(msg, serverEntry);
        });
    }
}
