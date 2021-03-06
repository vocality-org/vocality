import { Message } from 'discord.js';
import { QueueContract } from '../types/QueueContract';

export class ServerQueueController {
  private static instance: ServerQueueController;
  private serverQueues: Map<string, QueueContract>;

  private constructor() {
    this.serverQueues = new Map();
  }

  static getInstance(): ServerQueueController {
    if (!this.instance) {
      this.instance = new ServerQueueController();
    }
    return this.instance;
  }

  add(id: string, entry: QueueContract) {
    this.serverQueues.set(id, entry);
  }

  removeAll() {
    this.serverQueues.clear();
  }

  find(id: string): QueueContract | undefined {
    return this.serverQueues.get(id);
  }

  getAll(): Map<string, QueueContract> {
    return this.serverQueues;
  }

  findOrCreateFromMessage(msg: Message): QueueContract {
    const existingEntry = this.find(msg.guild!.id);
    if (
      existingEntry &&
      existingEntry.voiceChannel &&
      existingEntry.textChannel
    ) {
      return existingEntry;
    }
    const newEntry: QueueContract = {
      connection: undefined,
      songs: [],
      textChannel: msg.channel,
      voiceChannel: msg.member?.voice.channel,
      isLooping: false,
      isShuffling: false,
      currentlyPlaying: 0,
      isAutoplaying: false,
      volume: 0.5,
    };
    if (
      existingEntry &&
      !existingEntry.voiceChannel &&
      !existingEntry.textChannel
    ) {
      this.serverQueues.delete(msg.guild!.id);
      this.serverQueues.set(msg.guild!.id, newEntry);
    }
    this.add(msg.guild!.id, newEntry);
    return newEntry;
  }

  findOrCreateFromGuildId(guildId: string): QueueContract {
    const existingEntry = this.find(guildId);
    if (
      existingEntry &&
      existingEntry.voiceChannel &&
      existingEntry.textChannel
    ) {
      return existingEntry;
    } else {
      return {
        connection: undefined,
        songs: [],
        textChannel: undefined,
        voiceChannel: undefined,
        isLooping: false,
        isShuffling: false,
        currentlyPlaying: 0,
        isAutoplaying: false,
        volume: 0.5,
      };
    }
  }

  remove(id: string): void {
    this.serverQueues.delete(id);
  }
}
