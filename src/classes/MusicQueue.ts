export class MusicQueue {
  queue: string[];

  constructor() {
    this.queue = [];
  }

  add(entry: string) {
    this.queue.push(entry);
  }

  removeAll() {
    this.queue = [];
  }

  removeFromStart(count: number) {
    this.queue.splice(0, count);
  }

  removeAtIndex(index: number) {
    this.queue.splice(index, 1);
  }

  getCurrent(): string | undefined {
    return this.queue[0];
  }

  getNext(): string | undefined {
    return this.queue.shift();
  }
}