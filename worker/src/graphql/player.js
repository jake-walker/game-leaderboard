const {
  GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt,
} = require('graphql');
const { basicResolver } = require('./kv_resolver');

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
      gameIds: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        resolve: basicResolver('player', 'gameIds'),
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
