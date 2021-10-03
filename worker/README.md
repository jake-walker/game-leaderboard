# Game Leaderboard Worker

This is the Game Leaderboard backend which takes requests from clients and acts on them. The requests are parsed as GraphQL using the plain library (rather than any fancy frameworks like Apollo). This stores data in Workers KV which is a key-value database.

## Setup & Development

Run `yarn install --dev` to install dependencies and `yarn run dev` to start a development server.

## Environment Variables

These environment variables can be set to change functionality:

> Enabling the preshared auth header will cause the included web client to stop working (as the header won't be set)

- `LB_ALLOWED_IPS_ENABLED` - Whether IP checking is enabled (`yes` to enable)
- `LB_ALLOWED_IPS` - Set to an IP address with an optional CIDR to prevent connections outside that IP
- `LB_PRESHARED_AUTH_HEADER_ENABLED` - Whether a 'password' required for requests (`yes` to enable)
- `LB_PRESHARED_AUTH_HEADER_KEY` - The header name to use for auth header
- `LB_PRESHARED_AUTH_HEADER_VALUE` - The required content for the auth header

## Deploying on Cloudflare

Firstly, setup & install the Wrangler CLI.

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
```

Finally, run `wrangler publish` and the Worker will be deployed on your account's worker.dev domain.

You can fork this repository and use the GitHub Actions Workflow to automatically deploy any changes to your account. You will need to set the `CF_API_TOKEN` secret in your repository settings.
