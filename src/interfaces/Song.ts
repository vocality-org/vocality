import { MessageEmbedAuthor } from "discord.js";
import { Author } from "./Author";

export interface Song {
  url: string;
  title: string;
  length: string;
  length_ms: number;
  thumbnail_url: string;
  author: Author;
  interpreters: string | undefined;
  songName: string | undefined;
}
