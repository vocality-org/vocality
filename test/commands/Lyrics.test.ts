import * as assert from 'assert';
import { ResponseClient } from 'discord-response-mock';

export const lyrics = (client: ResponseClient) => {
  it('should send warn message if there is no song in queue and no arguments are provided', done => {
    client.write('lyrics', response => {
      assert.equal(
        response.content,
        'No Song in Queue and no argument provided'
      );
      done();
    });
  });
};
