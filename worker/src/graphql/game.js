const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');
const { GraphQLDateType } = require('./date');
const { basicResolver } = require('./kv_resolver');

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
      winnerId: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: basicResolver('game', 'winnerId'),
      },
      loserId: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: basicResolver('game', 'loserId'),
      },
      location: {
        type: GraphQLString,
        resolve: basicResolver('game', 'location'),
      },
    },
  }),
};
