import {
  TextChannel,
  VoiceChannel,
  VoiceConnection,
  DMChannel,
  GroupDMChannel
} from "discord.js";
import { Song } from "./Song";

export interface QueueContract {
  textChannel: TextChannel | DMChannel | GroupDMChannel;
  voiceChannel: VoiceChannel;
  connection: VoiceConnection | null;
  songs: Song[];
  page: number;
  lyricsFragments: string[];
}
