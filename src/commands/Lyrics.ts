import { Command } from "../interfaces/Command";
import { Message, RichEmbed } from "discord.js";
import { QueueContract } from "../interfaces/QueueContract";
import { AuthOptions } from "request";
import { config } from "../config";
import cheerio from "cheerio";
import fetch from "node-fetch";
import queryString from "query-string";

export class Lyrics implements Command {
  execute(msg: Message, args: string[], serverEntry: QueueContract): void {
    if (serverEntry.songs.length === 0) msg.channel.send("No Song in Queue");
    else {
      var auth: AuthOptions = { bearer: "Bearer " + config.GENIUS_API_TOKEN };
      var song = serverEntry.songs[0];
      var searchString: any = { q: "" };
      if (song.interpreters && song.songName) {
        searchString.q = `${song.songName} by ${song.interpreters}`;
      } else if (song.interpreters && !song.songName) {
        searchString.q = `${song.interpreters}`;
      } else if (!song.interpreters && song.songName) {
        searchString.q = `${song.songName}`;
      } else if (!song.interpreters && !song.songName) {
        msg.channel.send("No lyrics found");
        return;
      }
      fetch(
        config.GENIUS_API_URI +
          "/search?" +
          queryString.stringify(searchString) +
          "&access_token=" +
          config.GENIUS_API_TOKEN,
        { headers: { "content-type": "application/json" }, method: "GET" }
      ).then(async response => {
        const data = await response.json();
        var WebsiteData = await fetch(data.response.hits[0].result.url);
        var website = await WebsiteData.text();
        const $ = cheerio.load(website as any);
        let lyrics = $(".lyrics").text();
        serverEntry.lyricsFragments = [];
        const sites = lyrics.length / 2048;
        let x = 0;
        for (let i = 0; i < sites; i++) {
          let start = x;
          x = x + 2048;
          serverEntry.lyricsFragments.push(lyrics.substr(start, x));
        }

        const embed = new RichEmbed()
          .setTitle(`Lyrics for ${song.title}`)
          .setURL(data.response.hits[0].result.url)
          .setDescription(serverEntry.lyricsFragments[0])
          .setColor("#00e773")
          .setFooter(
            `Page ${serverEntry.page} of ${serverEntry.lyricsFragments.length}`
          );
        msg.channel.send(embed);
      });
    }
  }
}
