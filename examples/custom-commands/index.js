import { Bot, loadCommands } from '@vocality-org/core';
import * as commands from './commands';

const bot = new Bot({ token: 'DISCORD_BOT_TOKEN' });
const customCommands = loadCommands(commands);

bot.addCommands(customCommands);
bot.start();
