const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');
const { GraphQLDateType } = require('./date');
const { basicResolver, nestedResolver } = require('./kv_resolver');
const { GraphQLPlayerType } = require('./player');

// This is a custom GraphQL type for games
module.exports = {
  GraphQLGameType: new GraphQLObjectType({
    name: 'Game',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      date: {
        type: new GraphQLNonNull(GraphQLDateType),
        resolve: basicResolver('game', 'date'),
      },
      winner: {
        type: new GraphQLNonNull(GraphQLPlayerType),
        resolve: nestedResolver('game', 'winnerId'),
      },
      loser: {
        type: new GraphQLNonNull(GraphQLPlayerType),
        resolve: nestedResolver('game', 'loserId'),
      },
      location: {
        type: GraphQLString,
        resolve: basicResolver('game', 'location'),
      },
    },
  }),
};
