import { Vote } from '../types/Vote';
import { Message } from 'discord.js';
import { buildStatsMessage } from './buildStatsMessage';
import { FileOperations } from './FileOperations';

export const handleDelete = (serverQueue: Vote, msg: Message) => {
  if (serverQueue.initiator !== msg.author.id) {
    msg.channel.send('You are not authorized to stop the Poll');
    return;
  }
  buildStatsMessage(serverQueue, msg);
  const data = FileOperations.readFromFile();
  const guildId = serverQueue.initMessage.guild.id;
  let map = new Map();
  if (data !== undefined) {
    map = new Map(JSON.parse(data));
    map.has(guildId)
      ? map.get(guildId).push(serverQueue)
      : map.set(guildId, [serverQueue]);
  } else {
    map.set(guildId, [serverQueue]);
  }
  FileOperations.writeToFile(map);
};
