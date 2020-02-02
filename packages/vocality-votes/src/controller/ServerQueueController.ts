import { Message } from 'discord.js';
import { Vote } from '../types/Vote';
import uuid from 'uuid/v1';

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
    const existingEntry = this.find(msg.guild!.id);
    if (existingEntry?.find(v => v.initMessage!.id === msg.id)) {
      return existingEntry?.find(v => v.initMessage!.id === msg.id)!;
    }
    const newEntry: Vote = {
      id: uuid(),
      initiator: msg.author.id,
      textChannel: msg.channel,
      initMessage: msg,
      votingMessage: undefined,
      maxSteps: 5,
      currentStep: 0,
      question: '',
      votes: [],
      anonymous: false,
      startTime: new Date(),
      maxVotes: 0,
      allowedToVote: ['0'],
    };
    existingEntry?.push(newEntry);
    return newEntry;
  }

  findOrCreateFromGuildId(guildId: string): Vote[] | undefined {
    let existingEntry = this.find(guildId);
    if (!existingEntry) {
      existingEntry = this.serverQueues.set(guildId, []).get(guildId);
    }
    return existingEntry;
  }

  remove(id: string): void {
    this.serverQueues.delete(id);
  }
}
