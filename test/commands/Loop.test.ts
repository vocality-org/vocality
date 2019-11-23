import { ResponseClient } from 'discord-response-mock';
import * as assert from 'assert';

export const loop = (client: ResponseClient) => {
  it('It should notify the user that loop is now enabled', done => {
    client.write('loop').then(response => {
      assert.equal(response.content, 'Repeating is now `enabled`');
      done();
    });
  });
};
