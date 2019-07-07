const Bot = {
  PREFIX: "?",
  SERVERPREFIXES: {} as GuildPrefixMap,
  TOKEN: "NTg5NTk1MTg5NjMxMzg1NjAy.XQWd1w.5yZcJNlE3Hs5sRqePdXX0sBvH6Y",
  SHARDS: 1
};
interface GuildPrefixMap {
  [key: string]: string;
}

/**
 * Colors for Embeds
 */
const Color = {
  PRIMARY: "#0c003f",
  PRIMARY_VARIANT: "#29abe2",
  SECONDARY: "#ff3f60",
  BACKGROUND: "#121212"
};

/**
 * Mappings for Emojis
 * https://www.webfx.com/tools/emoji-cheat-sheet/
 */
const Emoji = {
  ARROW_BACKWARD: "◀",
  ARROW_FORWARD: "▶",
  DIGITS: [
    ":zero:",
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:"
  ]
};

const Genius = {
  GENIUS_API_TOKEN:
    "yVke9GpZpG1prMfz1g3TbFYeXZOmMRNRneGECQXmt5EWMD8cCo_o67577jkeVwUn",
  GENIUS_API_URI: "https://api.genius.com"
};
const Youtube = {
  YOUTUBE_API_TOKEN: "AIzaSyB5ZJwINSfiQZ1tVD-gdhbsFgINT4QJ_8E"
};

export { Bot, Color, Emoji, Genius, Youtube };
