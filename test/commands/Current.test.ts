import * as assert from 'assert';
import { ResponseClient } from 'discord-response-mock';
import { TEST_CONSTANTS } from './config';

export const current = (client: ResponseClient) => {
  it('should send warn message if there is no song currently playing', done => {
    client.write('current', response => {
      assert.equal(response.content, 'No song is playing');
      done();
    });
  });
};
