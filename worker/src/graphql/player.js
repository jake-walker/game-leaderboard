const {
  GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt,
} = require('graphql');
const { basicResolver } = require('./kv_resolver');

// This is a custom GraphQL type for players
module.exports = {
  GraphQLPlayerType: new GraphQLObjectType({
    name: 'Player',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: basicResolver('player', 'name'),
      },
      wins: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: basicResolver('player', 'wins'),
      },
      losses: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: basicResolver('player', 'losses'),
      },
      rank: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: basicResolver('player', 'rank'),
      },
    },
  }),
};
