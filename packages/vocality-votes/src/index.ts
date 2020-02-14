import {
  BasePlugin,
  loadCommands,
  addCustomListener,
  findGuild,
  emitCustomEvent,
} from '@vocality-org/core';
import { Command } from '@vocality-org/types';
import * as commandDefs from './commands';
import { ServerQueueController } from './controller/ServerQueueController';
import { TextChannel } from 'discord.js';
import { removeReaction } from './utils/removeReaction';
import { BACKUP } from './config';

class VotesPlugin extends BasePlugin {
  commands: Command[];
  hasListener: boolean;
  constructor() {
    super();
    this.hasListener = false;
    this.config.displayName = 'vocality-votes';
    this.commands = loadCommands(commandDefs) as Command[];
  }

  load(guildId: string) {
    ServerQueueController.getInstance().findOrCreateFromGuildId(guildId);
    if (!this.hasListener) {
      addCustomListener('messageReactionRemove', removeReaction);
      addCustomListener('raw', (packet: any) => {
        if (
          !['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(
            packet.t
          )
        )
          return;
        // Grab the channel to check the message from
        const channel = findGuild(guildId)!.channels.cache.get(
          packet.d.channel_id
        ) as TextChannel;
        // There's no need to emit if the message is cached, because the event will fire anyway for that
        if (channel!.messages.cache.has(packet.d.message_id)) return;
        // Since we have confirmed the message is not cached, let's fetch it
        channel!.messages.fetch(packet.d.message_id).then(message => {
          // Emojis can have identifiers of name:id format, so we have to account for that case as well
          const emoji = packet.d.emoji.id
            ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
            : packet.d.emoji.name;
          // This gives us the reaction we need to emit the event properly, in top of the message object
          const reaction = message.reactions.cache.get(emoji);
          // Adds the currently reacting user to the reaction's users collection.
          if (reaction)
            reaction.users.cache.set(
              packet.d.user_id,
              findGuild(guildId)!.members.cache.get(packet.d.user_id)?.user!
            );
          // Check which type of event it is before emitting
          if (packet.t === 'MESSAGE_REACTION_ADD') {
            emitCustomEvent(
              'messageReactionAdd',
              reaction,
              findGuild(guildId)!.members.cache.get(packet.d.user_id)?.user!
            );
          }
          if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            emitCustomEvent(
              'messageReactionRemove',
              reaction,
              findGuild(guildId)!.members.cache.get(packet.d.user_id)?.user!
            );
          }
        });
      });
    }

    if (!this.hasListener) {
      this.hasListener = true;
    }
  }

  unload(guildId: string) {
    ServerQueueController.getInstance().remove(guildId);
  }
  saveBackupPath(path: string) {
    BACKUP.path = path;
  }
}
export const votesPlugin = new VotesPlugin();
