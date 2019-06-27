import { QueueContract } from "../interfaces/QueueContract";

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

  remove(id: string): void {
    this.serverQueues.delete(id);
  }
}
