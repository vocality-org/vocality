const Bot = require('@vocality-org/core').Bot;

const bot = new Bot({ token: 'DISCORD_BOT_TOKEN' });
const customCommands = require('./commands');

bot.addCustomCommands(customCommands);
bot.start();
