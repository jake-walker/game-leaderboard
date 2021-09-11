# Game Leaderboard

A simple web app for recording office pool, table tennis, football table or other games.

This project utilises [Cloudflare Workers](https://workers.cloudflare.com/), [Cloudflare Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [Cloudflare Pages](https://pages.cloudflare.com/) to create a lightning fast, serverless leaderboard which can be run for free (depending on the size of your office).

At the heart of the project, the Worker function parses API requests and reads and writes data to Workers KV. Pages stores and serves the user interface for interacting with the Worker function.

## Deployment

To deploy the Worker function, run the following

```bash
wrangler publish
```

To deploy the Pages site, run the following

```bash
# coming soon!
```

## Todo

- [x] Validation of user input
- [ ] Add unit tests?
- [ ] Write Pages site
- [ ] IP address filtering (list of CIDRs?)
- [ ] Basic password authentication
