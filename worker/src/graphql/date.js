const { GraphQLScalarType, Kind } = require('graphql');

module.exports = {
  GraphQLDateType: new GraphQLScalarType({
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
    },
  }),
};
