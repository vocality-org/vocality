import {
  TextChannel,
  VoiceChannel,
  VoiceConnection,
  DMChannel,
  GroupDMChannel,
} from 'discord.js';
import { Song } from './Song';

export interface QueueContract {
  textChannel: TextChannel | DMChannel | GroupDMChannel | undefined;
  voiceChannel: VoiceChannel | undefined;
  connection: VoiceConnection | undefined;
  songs: Song[];
  isLooping: boolean;
  isShuffling: boolean;
  isAutoplaying: boolean;
  currentlyPlaying: number;
  volume: number;
}
