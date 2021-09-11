const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require('graphql');
const { GraphQLDateType } = require('./date');
const kv = require('../kv');

module.exports = {
  GraphQLGameType: new GraphQLObjectType({
    name: 'Game',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      date: {
        type: new GraphQLNonNull(GraphQLDateType),
        resolve: async (obj) => {
          if ('date' in obj) return obj.date;
          return kv.getAttribute('game', obj.id, 'date');
        },
      },
      winnerId: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: async (obj) => {
          if ('winnerId' in obj) return obj.winnerId;
          return kv.getAttribute('game', obj.id, 'winnerId');
        },
      },
      loserId: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: async (obj) => {
          if ('loserId' in obj) return obj.loserId;
          return kv.getAttribute('game', obj.id, 'loserId');
        },
      },
      location: {
        type: GraphQLString,
        resolve: async (obj) => {
          if ('location' in obj) return obj.location;
          return kv.getAttribute('game', obj.id, 'location');
        },
      },
    },
  }),
};
