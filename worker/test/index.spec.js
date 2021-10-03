const test = require('ava');
const { Miniflare } = require('miniflare');

test.beforeEach((t) => {
  const mf = new Miniflare({
    buildCommand: undefined,
  });

  // eslint-disable-next-line no-param-reassign
  t.context = { mf };
});

test('creating player does not error', async (t) => {
  const { mf } = t.context;

  const res = await mf.dispatchFetch('http://localhost:8787/', {
    method: 'POST',
    body: JSON.stringify({
      query: 'mutation { addPlayer(name: "Test Player") { name }}',
    }),
  });
  const json = await res.json();
  const errors = json.errors || [];

  t.is(errors.length, 0);
});

test('creating game with non-existent players errors', async (t) => {
  const { mf } = t.context;

  const res = await mf.dispatchFetch('http://localhost:8787/', {
    method: 'POST',
    body: JSON.stringify({
      query: 'mutation { addGame(winner: "idontexist1", loser: "idontexist2") { date }}',
    }),
  });
  const json = await res.json();
  const errors = json.errors || [];

  t.not(errors.length, 0);
});
