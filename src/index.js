const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        hello: String
    }
`);

const root = {
    hello: () => 'Hello World!'
}

addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    if (request.method != 'POST') {
        return new Response("Method not supported", {
            headers: { "content-type": "text/plain" },
            status: 400
        });
    }

    const reqData = await request.json();
    const resData = await graphql(schema, '{ hello }', root, {}, reqData.variables);

    return new Response(JSON.stringify(resData), {
        headers: { "content-type": "text/json" }
    })
}
