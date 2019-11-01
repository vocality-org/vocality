import * as assert from 'assert';
import { ArgumentParser } from '../../src/core/ArgumentParser';
import { BotError } from '../../src/core/BotError';
import { Command } from '../../src/interfaces/Command';

describe('ArgumentParser', () => {
  describe('.parseInput()', () => {
    it('should throw error on empty message', () => {
      assert.throws(() => ArgumentParser.parseInput(''), BotError);
    });

    it('should split the message', () => {
      const splittedArgs = ['arg1', 'arg2', 'arg3'];
      const parsedArgs = ArgumentParser.parseInput('arg1 arg2 arg3');
      assert.deepStrictEqual(parsedArgs, splittedArgs);
    });
  });

  describe('validateArguments', () => {
    it('should throw error when command has arguments but none are provided', () => {
      const commandWithArgs: Command = {
        options: {
          name: '',
          description: '',
          socketEnabled: false,
          hasArguments: true,
        },
        execute: () => {},
      };
      assert.throws(
        () => ArgumentParser.validateArguments(commandWithArgs, []),
        BotError
      );
    });
  });

  it('should not throw error when command does not have arguments', () => {
    const commandWithArgs: Command = {
      options: {
        name: '',
        description: '',
        socketEnabled: false,
        hasArguments: true,
      },
      execute: () => {},
    };
    assert.doesNotThrow(
      () => ArgumentParser.validateArguments(commandWithArgs, ['arg1']),
      BotError
    );
  });
});
