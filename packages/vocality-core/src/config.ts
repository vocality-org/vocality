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
  WHITE_CHECK_MARK: ':white_check_mark:',
  RED_X: ':x:',
  LIST_ITEM_POINT: '•',
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

export { BOT, COLOR, EMOJI };
