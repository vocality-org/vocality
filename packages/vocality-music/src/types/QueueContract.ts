import {
  TextChannel,
  VoiceChannel,
  VoiceConnection,
  DMChannel,
} from 'discord.js';
import { Song } from './Song';

export interface QueueContract {
  textChannel: TextChannel | DMChannel | undefined;
  voiceChannel: VoiceChannel | undefined | null;
  connection: VoiceConnection | undefined;
  songs: Song[];
  isLooping: boolean;
  isShuffling: boolean;
  isAutoplaying: boolean;
  currentlyPlaying: number;
  volume: number;
}
