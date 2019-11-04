import { ServerQueueController } from './../../src/core/ServerQueueController';
import io from 'socket.io-client';
import * as assert from 'assert';

import { socketio as server } from '../../src/dashboard-ws/index';
import { Song } from '../../src/interfaces/Song';

const socketUrl = 'http://0.0.0.0:3000';
const options: SocketIOClient.ConnectOpts = {
  transports: ['websocket'],
  reconnection: false,
  forceNew: true,
};

console.log(server);

let client: SocketIOClient.Socket;

describe('dashboard-ws', () => {
  beforeEach(() => {
    client = io(socketUrl, options);
    client.connect();
  });

  describe('connection (no auth)', () => {
    it('should be successful', done => {
      client.on('connect', () => {
        assert.equal(client.connected, true);
        done();
      });
    });
  });

  describe('.emit(botGuilds)', () => {
    it('should return list of guildIds when matches exist', done => {
      const guildIds = ['000', '111', '222'];

      ServerQueueController.getInstance().add(guildIds[0], {} as any);
      ServerQueueController.getInstance().add(guildIds[1], {} as any);
      ServerQueueController.getInstance().add(guildIds[2], {} as any);

      client.on('botGuilds', (data: string[]) => {
        assert.deepStrictEqual(data, guildIds);
        done();
      });

      client.emit('userGuilds', guildIds);
    });

    it('should return empty array if no matches are found', done => {
      client.on('botGuilds', (data: string[]) => {
        assert.deepStrictEqual(data, []);
        done();
      });

      client.emit('userGuilds', []);
    });
  });

  describe('.on(command)', () => {
    it('should return error if command is empty', done => {
      client.on('commandError', data => {
        assert.equal(data, 'Command must have a name');
        done();
      });

      client.emit('command', {});
    });

    it('should return error if command is not enabled for socket', done => {
      client.on('commandError', data => {
        assert.equal(data, 'Command not enabled for websockets');
        done();
      });

      client.emit('command', {
        name: 'help',
      });
    });
  });
});

after(() => {
  server.close();
  client.close();
});
