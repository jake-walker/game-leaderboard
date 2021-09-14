# Game Leaderboard Worker

This is the Game Leaderboard backend which takes requests from clients and acts on them. The requests are parsed as GraphQL using the plain library (rather than any fancy frameworks like Apollo). This stores data in Workers KV which is a key-value database.

## Setup && Development

```bash
# Install Cloudflare's Wrangler CLI
yarn global add @cloudflare/wrangler

# Now login to your Cloudflare account
wrangler login

# Keep a note of your account ID
wrangler whoami

# Create a new KV namespace, and keep note of the ID
wrangler kv:namespace create "LEADERBOARD"

# Now, update the wrangler.toml file and put in your account ID and KV namespace ID.

# Finally, run a development server
wrangler dev
```

## Deploying on Cloudflare

To deploy, simply run `wrangler publish` and the Worker will be deployed on your account's worker.dev domain.

You can fork this repository and use the GitHub Actions Workflow to automatically deploy any changes to your account. You will need to set the `CF_API_TOKEN` secret in your repository settings.
