const { GraphQLScalarType, Kind } = require('graphql');

// This is a custom date type, as GraphQL does not have a date type built in.
module.exports = {
  GraphQLDateType: new GraphQLScalarType({
    name: 'Date',
    serialize(value) {
      return (new Date(value)).getTime();
    },
    parseValue(value) {
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
};
