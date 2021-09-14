const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);

// To get a relational database type feel, IDs are structured so that they can be searched easily.
// They are in the format TYPE:IDENTIFIER:ATTRIBUTE.
// You can get a list by using the prefix of a key, so you can list TYPE: to get all the items of a
// specific type or TYPE:IDENTIFIER: to get all the attributes for a specific item.
// e.g. an pet {"id": 123, "type": "dog", "name": "coco", "age": "3"} would be stored as
//    pet:123:type = dog
//    pet:123:name = coco
//    pet:123:age  = 3

async function set(type, obj) {
  // Generate an ID if there isn't one
  // This allows an entire object to be updated
  const id = obj.id || nanoid();

  await Promise.all(Object.entries(obj).map(async ([key, value]) => {
    if (key === 'id') return;
    await LEADERBOARD.put(`${type}:${id}:${key}`, JSON.stringify(value));
  }));

  return id;
}

async function exists(type, id) {
  const result = await LEADERBOARD.list({ prefix: `${type}:${id}:`, limit: 1 });
  return result.keys.length > 0;
}

async function setAttribute(type, id, attribute, value) {
  await LEADERBOARD.put(`${type}:${id}:${attribute}`, JSON.stringify(value));
}

async function pushAttribute(type, id, attribute, value) {
  const key = `${type}:${id}:${attribute}`;
  const list = JSON.parse(await LEADERBOARD.get(key));
  list.push(value);
  await LEADERBOARD.put(key, JSON.stringify(list));
}

async function getAttribute(type, id, attribute) {
  const key = `${type}:${id}:${attribute}`;
  return JSON.parse(await LEADERBOARD.get(key));
}

async function incrementAttribute(type, id, attribute) {
  const key = `${type}:${id}:${attribute}`;
  let value = JSON.parse(await LEADERBOARD.get(key));
  value += 1;
  await LEADERBOARD.put(key, JSON.stringify(value));
}

async function remove(type, id) {
  const list = await LEADERBOARD.list({ prefix: `${type}:${id}:` });

  await Promise.all(list.keys.map(async ({ name }) => {
    await LEADERBOARD.delete(name);
  }));
}

async function findOne(type, id) {
  const list = await LEADERBOARD.list({ prefix: `${type}:${id}:` });
  let output = null;

  await Promise.all(list.keys.map(async ({ name }) => {
    const key = name.split(':')[2];
    const value = JSON.parse(await LEADERBOARD.get(name));
    if (output === null) output = { id };
    output[key] = value;
  }));

  return output;
}

async function findAll(type) {
  const list = await LEADERBOARD.list({ prefix: `${type}:` });
  const output = {};

  await Promise.all(list.keys.map(async ({ name }) => {
    const id = name.split(':')[1];
    const key = name.split(':')[2];
    const value = JSON.parse(await LEADERBOARD.get(name));
    if (!(id in output)) {
      output[id] = {};
    }
    output[id][key] = value;
  }));

  return Object.entries(output).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

module.exports = {
  set,
  setAttribute,
  pushAttribute,
  incrementAttribute,
  findOne,
  findAll,
  remove,
  getAttribute,
  exists,
};
