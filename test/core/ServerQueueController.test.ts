import * as assert from 'assert';
import { ServerQueueController } from '../../src/core/ServerQueueController';
import { Message, TextChannel, Guild, Client } from 'discord.js';

describe('ServerQueueController', () => {
  beforeEach(() => {
    ServerQueueController.getInstance().removeAll();
  });

  describe('.getInstance()', () => {
    it('should return singleton instance', () => {
      const firstSq = ServerQueueController.getInstance();
      const secondSq = ServerQueueController.getInstance();
      assert.deepStrictEqual(firstSq, secondSq);
    });
  });

  describe('.add()', () => {
    it('should increase the queues length by 1', () => {
      const testSq = ServerQueueController.getInstance();
      testSq.add('test', {} as any);
      assert.strictEqual(testSq.getAll().size, 1);
    });
  });

  describe('.remove()', () => {
    it('should decrease queue length by 1', () => {
      const testSq = ServerQueueController.getInstance();
      testSq.add('test1', {} as any);
      testSq.add('test2', {} as any);
      testSq.add('test3', {} as any);
      testSq.remove('test3');
      assert.strictEqual(testSq.getAll().size, 2);
    });
  });

  describe('.removeAll()', () => {
    it('should decrease the queues length to 0', () => {
      const testSq = ServerQueueController.getInstance();
      testSq.add('test1', {} as any);
      testSq.add('test2', {} as any);
      testSq.add('test3', {} as any);
      testSq.removeAll();
      assert.strictEqual(testSq.getAll().size, 0);
    });
  });

  describe('.find()', () => {
    it('should return correct QueueContract', () => {
      const testSq = ServerQueueController.getInstance();
      testSq.add('test1', {} as any);
      testSq.add('test2', {} as any);
      testSq.add('test3', {} as any);
      const testFound = testSq.find('test2');
      assert.deepStrictEqual(testFound, {});
    });

    it('should return undefined on empty queue', () => {
      const testSq = ServerQueueController.getInstance();
      assert.strictEqual(testSq.find('id'), undefined);
    });

    it('should return undefined if key is not in queue', () => {
      const testSq = ServerQueueController.getInstance();
      testSq.add('test1', {} as any);
      testSq.add('test2', {} as any);
      assert.strictEqual(testSq.find('test3'), undefined);
    });
  });

  describe('.getAll()', () => {
    it('should return correct size after adding entries', () => {
      const testSq = ServerQueueController.getInstance();
      testSq.add('test1', {} as any);
      testSq.add('test2', {} as any);
      testSq.add('test3', {} as any);
      assert.strictEqual(testSq.getAll().size, 3);
    });

    it('should return correct size on empty queue', () => {
      const testSq = ServerQueueController.getInstance();
      assert.strictEqual(testSq.getAll().size, 0);
    });
  });
});
