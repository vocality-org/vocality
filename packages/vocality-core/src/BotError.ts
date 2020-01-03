export class BotError extends Error {
  constructor(error: string) {
    super(error);
    this.name = BotError.name;
  }
}
