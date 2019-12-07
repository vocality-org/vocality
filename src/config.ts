const BOT = {
  PREFIX: '?',
  SERVERPREFIXES: {} as GuildPrefixMap,
  TOKEN: 'NTg5NTk1MTg5NjMxMzg1NjAy.XQWd1w.5yZcJNlE3Hs5sRqePdXX0sBvH6Y',
  SHARDS: 1,
};
interface GuildPrefixMap {
  [key: string]: string;
}

/**
 * Colors for Embeds
 */
const COLOR = {
  CYAN: '#29abe2',
  PINK: '#ff3f60',
  GREY: '#121212',
};

/**
 * Mappings for Emojis
 * https://www.webfx.com/tools/emoji-cheat-sheet/
 */
const EMOJI = {
  ARROW_BACKWARD: '◀',
  ARROW_FORWARD: '▶',
  WARNING: '⚠',
  DIGITS: [
    ':zero:',
    ':one:',
    ':two:',
    ':three:',
    ':four:',
    ':five:',
    ':six:',
    ':seven:',
    ':eight:',
    ':nine:',
  ],
};

const GENIUS = {
  GENIUS_API_URI: 'https://api.genius.com',
};

export { BOT, COLOR, EMOJI, GENIUS };
