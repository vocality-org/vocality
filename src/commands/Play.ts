import { Message, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import { Command } from '../interfaces/Command';
import { QueueContract } from '../interfaces/QueueContract';
import { Song } from '../interfaces/Song';
import { ServerQueueController } from '../core/ServerQueueController';
import isUrl from 'is-url';
import { YouTube } from '../musicAPIs/YouTube';
import { onCurrentSongChange, onQueueChange } from '../dashboard-ws';

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
            const yt = new YouTube();
            let song: Song;

            if (isUrl(args[0])) {
                const url = args[0];
                song = await yt.getInformation(url);
            } else {
                const searchParam: string = args.join('%20');
                song = await yt.search(searchParam);
            }

            if (!msg.author.bot) {
                song.requested_by = msg.author.username;
            } else {
                song.requested_by = 'Vocality Dashboard'; // man könnt bei messageData im socket event den user mitgeben
            }

            if (serverEntry.songs.length == 0) {
                serverEntry.songs.push(song);
                this.play(msg, serverEntry);
                onCurrentSongChange(serverEntry);
            } else {
                serverEntry.songs.push(song);
                msg.channel.send(`${song.title} has been added to the queue!`);
                onQueueChange(serverEntry);
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
