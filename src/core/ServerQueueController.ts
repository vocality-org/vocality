import { Message } from 'discord.js';
import { QueueContract } from '../interfaces/QueueContract';

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
        const existingEntry = this.find(msg.guild.id);
        if (existingEntry && existingEntry.voiceChannel && existingEntry.textChannel) return existingEntry;
        const newEntry: QueueContract = {
            connection: null,
            songs: [],
            textChannel: msg.channel,
            voiceChannel: msg.member.voiceChannel,
        };
        if (existingEntry && !existingEntry.voiceChannel && !existingEntry.textChannel) {
            this.serverQueues.delete(msg.guild.id);
            this.serverQueues.set(msg.guild.id, newEntry);
        }
        this.add(msg.guild.id, newEntry);
        return newEntry;
    }

    remove(id: string): void {
        this.serverQueues.delete(id);
    }
}
