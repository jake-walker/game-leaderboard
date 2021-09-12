const { graphql } = require('graphql');
const ipRangeCheck = require('ip-range-check');
const config = require('./config');
const { schema } = require('./graphql/root');

const headers = {
  'Content-Type': 'text/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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

  if (!ipRangeCheck(request.headers.get('CF-Connecting-IP'), config.allowedIps)) {
    return new Response(JSON.stringify({
      error: 'Not authorized',
    }), {
      headers,
      status: 401,
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
