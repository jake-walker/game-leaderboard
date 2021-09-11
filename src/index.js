const { graphql, buildSchema } = require('graphql');
const kv = require('./kv');

const headers = {
  "Content-Type": "text/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

const schema = buildSchema(`
  scalar Date

  type Player {
    id: String!
    name: String!
    gameIds: [String!]!
    wins: Int!
    losses: Int!
    rank: Int!
  }

  type Game {
    id: String!
    date: Date!
    winnerId: String!
    loserId: String!
    location: String
  }

  type Query {
    allPlayer: [Player!]!
    allGame: [Game!]!
    player(id: String!): Player
    game(id: String!): Game
  }

  type Mutation {
    addPlayer(name: String!): Player!
    addGame(winner: String!, loser: String!, location: String): Game!
  }
`);

const root = {
  allPlayer: async () => {
    return kv.findAll('player');
  },
  allGame: async () => {
    return kv.findAll('game');
  },
  player: async({ id }) => {
    return kv.findOne('player', id);
  },
  game: async({ id }) => {
    return kv.findOne('game', id);
  },
  addPlayer: async ({ name }) => {
    const player = {
      name,
      gameIds: [],
      wins: 0,
      losses: 0,
      rank: 1000
    }
    const id = await kv.set('player', player);
    return {
      id,
      ...player
    };
  },
  addGame: async({ winner, loser, location }) => {
    const game = {
      date: new Date(),
      winnerId: winner,
      loserId: loser,
      location: null
    };
    if (location) game.location = location;
    const id = await kv.set('game', game);
    await kv.pushAttribute('player', winner, 'gameIds', id);
    await kv.pushAttribute('player', loser, 'gameIds', id);
    await kv.incrementAttribute('player', winner, 'wins');
    await kv.incrementAttribute('player', loser, 'losses');
    return {
      id,
      ...game
    };
  }
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...headers,
        Allow: 'OPTIONS, POST'
      },
      status: 204
    });
  } else if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: "Method not supported"
    }), {
      headers,
      status: 400
    });
  }

  const reqData = await request.json();
  const resData = await graphql(schema, reqData.query, root, {}, reqData.variables, reqData.operationName);

  return new Response(JSON.stringify(resData), {
    headers
  })
}
