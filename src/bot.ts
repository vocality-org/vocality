import { Client } from "discord.js";
export class Bot {
  private _instance: Client = new Client();
  set instance(value: Client) {
    this._instance = value;
  }
  get instance() {
    return this._instance;
  }
  login() {
    this._instance.login(
      "NTg5NTk1MTg5NjMxMzg1NjAy.XQWd1w.5yZcJNlE3Hs5sRqePdXX0sBvH6Y"
    );
  }
}
