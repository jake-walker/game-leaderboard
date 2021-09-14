const { graphql } = require('graphql');
const config = require('./config');
const { schema } = require('./graphql/root');
const ipCheck = require('./security/ip-check');
const keyCheck = require('./security/key');

// Headers that are included with **all** responses
const headers = {
  'Content-Type': 'text/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': `Content-Type, ${config.presharedAuthHeaderKey}`,
};

async function handleRequest(request) {
  // Respond to CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...headers,
        Allow: 'OPTIONS, POST',
      },
      status: 204,
    });
  }

  // If IP checking or PSK is enabled, make sure they are valid
  if (!(ipCheck(request) && keyCheck(request))) {
    return new Response(JSON.stringify({
      error: 'You may need to add a key to your request or access from a different location.',
    }), {
      headers,
      status: 403,
    });
  }

  // If the request is not a post request
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not supported',
    }), {
      headers,
      status: 400,
    });
  }

  const reqData = await request.json();
  // Parse the request using GraphQL and get the response
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
