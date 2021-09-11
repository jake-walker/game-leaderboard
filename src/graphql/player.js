const {
  GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt,
} = require('graphql');
const kv = require('../kv');

module.exports = {
  GraphQLPlayerType: new GraphQLObjectType({
    name: 'Player',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: async (obj) => {
          if ('name' in obj) return obj.name;
          return kv.getAttribute('player', obj.id, 'name');
        },
      },
      gameIds: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
        resolve: async (obj) => {
          if ('gameIds' in obj) return obj.gameIds;
          return kv.getAttribute('player', obj.id, 'gameIds');
        },
      },
      wins: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: async (obj) => {
          if ('wins' in obj) return obj.wins;
          return kv.getAttribute('player', obj.id, 'wins');
        },
      },
      losses: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: async (obj) => {
          if ('losses' in obj) return obj.losses;
          return kv.getAttribute('player', obj.id, 'losses');
        },
      },
      rank: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: async (obj) => {
          if ('rank' in obj) return obj.rank;
          return kv.getAttribute('player', obj.id, 'rank');
        },
      },
    },
  }),
};
