import * as Discord from "discord.js";
import { Bot } from "./bot";

const client = new Discord.Client();
const bot = new Bot();
bot.instance = client;
