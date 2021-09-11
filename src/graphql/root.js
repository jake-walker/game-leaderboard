const {
  GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList,
} = require('graphql');
const { GraphQLPlayerType } = require('./player');
const { GraphQLGameType } = require('./game');
const kv = require('../kv');

module.exports = {
  schema: new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        player: {
          type: GraphQLPlayerType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: (_, { id }) => ({
            id,
          }),
        },
        game: {
          type: GraphQLGameType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: (_, { id }) => ({
            id,
          }),
        },
        allPlayer: {
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLPlayerType))),
          resolve: async () => kv.findAll('player'),
        },
        allGame: {
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLGameType))),
          resolve: async () => kv.findAll('game'),
        },
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: {
        addPlayer: {
          type: new GraphQLNonNull(GraphQLPlayerType),
          args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: async (_, { name }) => {
            const player = {
              name,
              gameIds: [],
              wins: 0,
              losses: 0,
              rank: 1000,
            };
            const id = await kv.set('player', player);
            player.id = id;
            return player;
          },
        },
        addGame: {
          type: new GraphQLNonNull(GraphQLGameType),
          args: {
            winner: { type: new GraphQLNonNull(GraphQLString) },
            loser: { type: new GraphQLNonNull(GraphQLString) },
            location: { type: GraphQLString },
          },
          resolve: async (_, { winner, loser, location }) => {
            const game = {
              date: new Date(),
              winnerId: winner,
              loserId: loser,
              location: location || null,
            };
            const id = await kv.set('game', game);
            game.id = id;
            return game;
          },
        },
      },
    }),
  }),
};
