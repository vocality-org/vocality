import {
  TextChannel,
  VoiceChannel,
  VoiceConnection,
  DMChannel,
  GroupDMChannel,
} from 'discord.js';
import { Song } from './Song';

export interface QueueContract {
  textChannel: TextChannel | DMChannel | GroupDMChannel | null;
  voiceChannel: VoiceChannel | null;
  connection: VoiceConnection | null;
  songs: Song[];
  isLooping: boolean;
  isShuffling: boolean;
  isAutoplaying: boolean;
  currentlyPlaying: number;
  volume: number;
}
