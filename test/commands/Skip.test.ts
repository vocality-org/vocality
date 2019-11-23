import { ResponseClient } from 'discord-response-mock';
import * as assert from 'assert';

export const skip = (client: ResponseClient) => {
  it('should send warn message if user is not in a voice channel', done => {
    client.write('skip').then(response => {
      assert.equal(
        response.content,
        'You have to be in a voice channel to skip!'
      );
      done();
    });
  });
};
