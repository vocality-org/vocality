import { Message } from 'discord.js';
import { onVolumeChange } from '../dashboard-ws';
import { ServerQueueController } from '../controller/ServerQueueController';
import { SocketCommandOptions, SocketCommand } from '../types/SocketCommand';

const UP_VALUE = 10;
const DOWN_VALUE = 10;

export class Volume implements SocketCommand {
  options: SocketCommandOptions = {
    id: {
      name: 'volume',
      aliases: ['vol'],
    },
    minArguments: 1,
    usage: 'volume [number or up/down]',
    description: 'Change the volume of the bot with a number or keyword',
    socketEnabled: true,
  };
  execute(msg: Message, args: string[]): void {
    this.run(args, msg.guild!.id, msg);
  }

  validateArguments(args: string[]): boolean {
    return (
      !isNaN(+args[0]) ||
      args[0].toLowerCase() === 'up' ||
      args[0].toLowerCase() === 'down' ||
      (args[0].match('\\^[+-]d{1,2}') ? true : false) // eg -10 or +5
    );
  }

  calculateVolume(arg0: string, volume: number): number {
    let relativeVolume: number | undefined;

    if (arg0.startsWith('-')) {
      relativeVolume = volume - parseFloat(arg0.substr(1));
    }
    if (arg0.startsWith('+')) {
      relativeVolume = volume + parseFloat(arg0.substr(1));
    }
    if (arg0.toLowerCase() === 'up') {
      relativeVolume = volume + UP_VALUE;
    }
    if (arg0.toLowerCase() === 'down') {
      relativeVolume = volume - DOWN_VALUE;
    }

    if (relativeVolume) {
      if (relativeVolume < 0) {
        return 0;
      }
      if (relativeVolume > 100) {
        return 100;
      }
      return relativeVolume;
    }

    return parseFloat(arg0);
  }

  run(args: string[], guildId: string, msg?: Message) {
    if (!this.validateArguments(args)) {
      msg?.reply('Volume is not valid');
      return;
    }

    const serverEntry = ServerQueueController.getInstance().find(guildId)!;
    const vol = this.calculateVolume(args[0], serverEntry.volume * 100);
    serverEntry.volume = vol / 100;

    if (serverEntry.connection) {
      serverEntry.connection!.dispatcher.setVolume(vol / 100);
    }

    msg?.reply(`Volume changed to ${vol}`);
    onVolumeChange(vol);
  }
}
