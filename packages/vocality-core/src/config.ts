const BOT = {
  PREFIX: '?',
  SERVERPREFIXES: {} as GuildPrefixMap,
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

const DEFAULT_PLUGINS = {
  music: { enabled: true, path: '@vocality-org/music' },
};

export { BOT, COLOR, EMOJI, DEFAULT_PLUGINS };
