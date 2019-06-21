import { MessageEmbedAuthor } from "discord.js";
import { Author } from "./Author";

export interface Song {
  url: string;
  title: string;
  length: string;
  thumbnail_url: string;
  author: Author;
}
