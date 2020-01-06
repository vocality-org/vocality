const { Bot } = require('@vocality-org/core');

const bot = new Bot({ token: 'DISCORD_BOT_TOKEN' });
const customCommands = require('./commands');

bot.addCustomCommands(customCommands);
bot.start();
