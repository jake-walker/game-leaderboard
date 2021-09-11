const { graphql, buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLScalarType, Kind, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const kv = require('./kv');

const headers = {
  "Content-Type": "text/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

const GraphQLDateType = new GraphQLScalarType({
  name: 'Date',
  serialize(value) {
    return value.getTime();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  }
});

const GraphQLPlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (obj) => {
        if ('name' in obj) { return obj.name }
        return kv.getAttribute('player', obj.id, 'name');
      }
    },
    gameIds: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      resolve: async (obj) => {
        if ('gameIds' in obj) { return obj.gameIds }
        return kv.getAttribute('player', obj.id, 'gameIds');
      }
    },
    wins: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (obj) => {
        if ('wins' in obj) { return obj.wins }
        return kv.getAttribute('player', obj.id, 'wins');
      }
    },
    losses: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (obj) => {
        if ('losses' in obj) { return obj.losses }
        return kv.getAttribute('player', obj.id, 'losses');
      }
    },
    rank: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: async (obj) => {
        if ('rank' in obj) { return obj.rank }
        return kv.getAttribute('player', id, 'rank');
      }
    }
  }
});

const GraphQLGameType = new GraphQLObjectType({
  name: 'Game',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateType),
      resolve: async (obj) => {
        if ('date' in obj) { return obj.date }
        return kv.getAttribute('game', obj.id, 'date')
      }
    },
    winnerId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (obj) => {
        if ('winnerId' in obj) { return obj.winnerId }
        return kv.getAttribute('game', obj.id, 'winnerId')
      }
    },
    loserId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (obj) => {
        if ('loserId' in obj) { return obj.loserId }
        return kv.getAttribute('game', obj.id, 'loserId')
      }
    },
    location :{
      type: GraphQLString,
      resolve: async (obj) => {
        if ('location' in obj) { return obj.location }
        return kv.getAttribute('game', obj.id, 'location')
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      player: {
        type: GraphQLPlayerType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (_, { id }) => ({
          id
        })
      },
      game: {
        type: GraphQLGameType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: (_, { id }) => ({
          id
        })
      },
      allPlayer: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLPlayerType))),
        resolve: async () => {
          return kv.findAll('player');
        }
      },
      allGame: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLGameType))),
        resolve: async () => {
          return kv.findAll('game');
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      addPlayer: {
        type: new GraphQLNonNull(GraphQLPlayerType),
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (_, { name }) => {
          const player = {
            name,
            gameIds: [],
            wins: 0,
            losses: 0,
            rank: 1000
          };
          const id = await kv.set('player', player);
          player.id = id;
          return player;
        }
      },
      addGame: {
        type: new GraphQLNonNull(GraphQLGameType),
        args: {
          winner: { type: new GraphQLNonNull(GraphQLString) },
          loser: { type: new GraphQLNonNull(GraphQLString) },
          location: { type: GraphQLString }
        },
        resolve: async (_, { winner, loser, location }) => {
          if (!location) location = null;
          const game = {
            date: new Date(),
            winnerId: winner,
            loserId: loser,
            location: location
          }
          const id = await kv.set('game', game);
          game.id = id;
          return game;
        }
      }
    }
  })
})

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
  const resData = await graphql(schema, reqData.query, null, null, reqData.variables, reqData.operationName);

  return new Response(JSON.stringify(resData), {
    headers
  })
}
