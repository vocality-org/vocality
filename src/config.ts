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
  PRIMARY: '#0c003f',
  PRIMARY_VARIANT: '#29abe2',
  SECONDARY: '#ff3f60',
  BACKGROUND: '#121212',
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
  GENIUS_API_TOKEN:
    'yVke9GpZpG1prMfz1g3TbFYeXZOmMRNRneGECQXmt5EWMD8cCo_o67577jkeVwUn',
  GENIUS_API_URI: 'https://api.genius.com',
};
const SPOTIFY = {
  SPOTIFY_ClIENT_ID: '53b09c59939a4ede99893a1f49e58c3f',
  SPOTIFY_CLIENT_SECRET: '17e2484828914e5ab5cb14a9150e368a',
  SPOTIFY_ACCESS_TOKEN: '',
};

export { BOT, COLOR, EMOJI, GENIUS, SPOTIFY };
