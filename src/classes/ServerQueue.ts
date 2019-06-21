import { QueueContract } from "../interfaces/QueueContract";

export class ServerQueue {
  queue: Map<string, QueueContract>;

  constructor() {
    this.queue = new Map();
  }

  add(id: string, entry: QueueContract) {
    this.queue.set(id, entry);
  }

  removeAll() {
    this.queue.clear();
  }

  find(id: string): QueueContract | undefined {
    return this.queue.get(id);
  }

  remove(id: string): void {
    this.queue.delete(id);
  }
}
