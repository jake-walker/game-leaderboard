const { graphql } = require('graphql');
const { schema } = require('./graphql/root');

const headers = {
  "Content-Type": "text/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...headers,
        Allow: 'OPTIONS, POST'
      },
      status: 204
    });
  } else if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: "Method not supported"
    }), {
      headers,
      status: 400
    });
  }

  const reqData = await request.json();
  const resData = await graphql(schema, reqData.query, null, null, reqData.variables, reqData.operationName);

  return new Response(JSON.stringify(resData), {
    headers
  })
}
