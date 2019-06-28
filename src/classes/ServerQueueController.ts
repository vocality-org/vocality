import { QueueContract } from "../interfaces/QueueContract";
import { Message } from "discord.js";

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

  findOrCreateFromMessage(msg: Message): QueueContract {
    const existingEntry = this.find(msg.guild.id);
    if (existingEntry) return existingEntry;

    const newEntry: QueueContract = {
      connection: null,
      songs: [],
      textChannel: msg.channel,
      voiceChannel: msg.member.voiceChannel,
    }
    
    this.add(msg.guild.id, newEntry);
    return newEntry;
  }

  remove(id: string): void {
    this.serverQueues.delete(id);
  }
}
