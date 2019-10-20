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
            let connection;

            if (msg.member.voiceChannel) {
                connection = await msg.member.voiceChannel.join();
            } else if (msg.member.user.bot) {
                const voiceChannel = msg.guild.channels.filter(g => g.type === 'voice').first() as VoiceChannel;
                connection = await voiceChannel.join();
                // console.log(connection);
            }

            serverEntry.connection = connection;
            const yt = new YouTube();
            let song: Song | null;

            if (isUrl(args[0])) {
                if(yt.parseYoutubeUrl(args[0])) {
                    if(args[0].includes('playlist')) {
                        let songs = await yt.getYtPlaylist(args[0]);
                        songs = songs.filter(songs => songs != null);
                        this.addPlaylist(songs as Song[], serverEntry, msg)
                    } else {
                        const url = args[0];
                        song = await yt.getInformation(url);
                        if(song)
                        this.addSong(song, serverEntry, msg);
                    }
                }
                
            } else {
                const searchParam: string = args.join('%20');
                song = await yt.search(searchParam);
                if(song)
                this.addSong(song, serverEntry, msg);
            }

            
        } else {
            msg.channel.send('Please join a voice channel');
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
            console.log('end');
            serverEntry.songs.shift();
            this.play(msg, serverEntry);
            onQueueChange(serverEntry);
        });

        onCurrentSongChange(serverEntry);
    }
    private addSong(song: Song, serverEntry: QueueContract, msg: Message) {
        if (!msg.author.bot) {
            song.requested_by = msg.author.username;
        } else {
            song.requested_by = 'Vocality Dashboard'; // man könnt bei messageData im socket event den user mitgeben
        }

        if (serverEntry.songs.length === 0) {
            serverEntry.songs.push(song);
            this.play(msg, serverEntry);
        } else {
            serverEntry.songs.push(song);
            msg.channel.send(`${song.title} has been added to the queue!`);
            onQueueChange(serverEntry);
        }
    }
    private addPlaylist(songs: Song[], serverEntry: QueueContract, msg : Message) {
        if (!msg.author.bot) {
            songs.forEach(song => {
                 song.requested_by = msg.author.username;
            })
        } else {
            songs.forEach(song => {
                song.requested_by = 'Vocality Dashboard';
           })
        }
        if (serverEntry.songs.length === 0) {
            serverEntry.songs = songs;
            msg.channel.send(`${songs.length} Songs have been added to the Queue`);
            this.play(msg, serverEntry);
        } else {
            serverEntry.songs.push(...songs);
            msg.channel.send(`${songs.length} Songs have been added to the Queue`);
            onQueueChange(serverEntry);
        }
        
    }
}
