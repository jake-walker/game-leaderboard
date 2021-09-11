const kv = require('../kv');

module.exports = {
  // If the value hasn't already been resolved (i.e. in one of the allPlayer/allGame queries) then
  // resolve it
  basicResolver(type, attribute) {
    return async (obj) => {
      if (attribute in obj) return obj[attribute];
      return kv.getAttribute(type, obj.id, attribute);
    };
  },

  // Check that the item exists and if it doesn't return null, otherwise return just the ID so that
  // other attributes are lazily loaded using the basicResolver
  rootResolver(type) {
    return async (_, { id }) => {
      if (!(await kv.exists(type, id))) return null;

      return {
        id,
      };
    };
  },
};
