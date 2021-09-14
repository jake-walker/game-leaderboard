const {
  GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList,
  GraphQLError,
} = require('graphql');
const EloRank = require('elo-rank');
const { GraphQLPlayerType } = require('./player');
const { GraphQLGameType } = require('./game');
const kv = require('../kv');
const { rootResolver } = require('./kv_resolver');

const elo = new EloRank();

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
          resolve: rootResolver('player'),
        },
        game: {
          type: GraphQLGameType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: rootResolver('game'),
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
            if (name.trim() === '') {
              throw new GraphQLError('Name is required');
            }

            const player = {
              name: name.trim(),
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
            let loc = location;

            if (winner === loser) {
              throw new GraphQLError('Winner and loser can\'t be the same');
            }

            if (!((await kv.exists('player', winner)) && (await kv.exists('player', loser)))) {
              throw new GraphQLError('Winner or loser does not exist');
            }

            if (!loc || loc.trim() === '') {
              loc = null;
            }

            const game = {
              date: new Date(),
              winnerId: winner,
              loserId: loser,
              location: loc,
            };
            const id = await kv.set('game', game);
            game.id = id;

            // Add the game ID to both players
            await kv.pushAttribute('player', winner, 'gameIds', id);
            await kv.pushAttribute('player', loser, 'gameIds', id);

            // Increment win/loss counters on both players
            await kv.incrementAttribute('player', winner, 'wins');
            await kv.incrementAttribute('player', loser, 'losses');

            // Calculate the player's new ranks
            const oldWinnerRank = await kv.getAttribute('player', winner, 'rank');
            const oldLoserRank = await kv.getAttribute('player', loser, 'rank');
            const newWinnerRank = elo.updateRating(
              elo.getExpected(oldWinnerRank, oldLoserRank), 1, oldWinnerRank,
            );
            const newLoserRank = elo.updateRating(
              elo.getExpected(oldLoserRank, oldWinnerRank), 0, oldLoserRank,
            );
            await kv.setAttribute('player', winner, 'rank', newWinnerRank);
            await kv.setAttribute('player', loser, 'rank', newLoserRank);

            return game;
          },
        },
      },
    }),
  }),
};
