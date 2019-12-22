import { Client } from './Client';

export interface Handler<T = any> {
  bot: Client;

  handle(message: T): void;
}
