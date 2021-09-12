const { graphql } = require('graphql');
const config = require('./config');
const { schema } = require('./graphql/root');
const ipCheck = require('./security/ip-check');
const keyCheck = require('./security/key');

const headers = {
  'Content-Type': 'text/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': `Content-Type, ${config.presharedAuthHeaderKey}`,
};

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...headers,
        Allow: 'OPTIONS, POST',
      },
      status: 204,
    });
  }

  if (!(ipCheck(request) && keyCheck(request))) {
    return new Response(JSON.stringify({
      error: 'You may need to add a key to your request or access from a different location.',
    }), {
      headers,
      status: 403,
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not supported',
    }), {
      headers,
      status: 400,
    });
  }

  const reqData = await request.json();
  const resData = await graphql(schema, reqData.query, null, null, reqData.variables,
    reqData.operationName);

  return new Response(JSON.stringify(resData), {
    headers,
  });
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
