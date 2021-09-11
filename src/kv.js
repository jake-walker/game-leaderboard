const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 6);

async function set(type, obj) {
  const id = obj.id || nanoid();

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'id') continue;
    await LEADERBOARD.put(`${type}:${id}:${key}`, JSON.stringify(value));
  }

  return id;
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
  console.log(`Getting ${attribute} for ${type} ${id}`);
  const key = `${type}:${id}:${attribute}`;
  return JSON.parse(await LEADERBOARD.get(key));
}

async function incrementAttribute(type, id, attribute) {
  const key = `${type}:${id}:${attribute}`;
  let value = JSON.parse(await LEADERBOARD.get(key));
  value++;
  await LEADERBOARD.put(key, JSON.stringify(value));
}

async function remove(type, id) {
  const list = await LEADERBOARD.list({ prefix: `${type}:${id}:` });
  for (const { name } of list.keys) {
    await LEADERBOARD.delete(name);
  }
}

async function findOne(type, id) {
  const list = await LEADERBOARD.list({ prefix: `${type}:${id}:` });
  let output = null;
  for (const { name } of list.keys) {
    const key = name.split(":")[2];
    const value = JSON.parse(await LEADERBOARD.get(name));
    if (output === null) output = { id };
    output[key] = value;
  }
  return output;
}

async function findAll(type) {
  const list = await LEADERBOARD.list({ prefix: `${type}:`});
  const output = {};
  for (const { name } of list.keys) {
    const id = name.split(":")[1];
    const key = name.split(":")[2];
    const value = JSON.parse(await LEADERBOARD.get(name));
    if (!(id in output)) {
      output[id] = {};
    }
    output[id][key] = value;
  }
  return Object.entries(output).map(([key, value]) => ({
    id: key,
    ...value
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
  getAttribute
}
