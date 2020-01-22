import { Message } from 'discord.js';
import { Vote } from '../types/Vote';

export class ServerQueueController {
  private static instance: ServerQueueController;
  private serverQueues: Map<string, Vote[]>;

  private constructor() {
    this.serverQueues = new Map();
  }

  static getInstance(): ServerQueueController {
    if (!this.instance) {
      this.instance = new ServerQueueController();
    }
    return this.instance;
  }

  removeAll() {
    this.serverQueues.clear();
  }

  find(id: string): Vote[] | undefined {
    return this.serverQueues.get(id);
  }
  findAndRemoveVote(guildId: string, serverQueue: Vote) {
    const existingEntry = this.find(guildId);
    existingEntry?.splice(
      existingEntry.findIndex(e => e.initiator === serverQueue.initiator),
      1
    );
  }

  getAll(): Map<string, Vote[]> {
    return this.serverQueues;
  }

  findOrCreateFromMessage(msg: Message): Vote {
    const existingEntry = this.find(msg.guild.id);
    if (existingEntry?.find(v => v.initiator === msg.author.id)) {
      return existingEntry?.find(v => v.initiator === msg.author.id)!;
    }
    const newEntry: Vote = {
      initiator: msg.author.id,
      textChannel: msg.channel,
      initMessage: msg,
      deadline: undefined,
      maxSteps: 5,
      currentStep: 0,
      question: '',
      votes: [],
      anonymous: false,
      allowedToVote: ['0'],
    };
    existingEntry?.push(newEntry);
    return newEntry;
  }

  findOrCreateFromGuildId(guildId: string): void {
    const existingEntry = this.find(guildId);
    if (!existingEntry) {
      this.serverQueues.set(guildId, []);
    }
  }

  remove(id: string): void {
    this.serverQueues.delete(id);
  }
}
