# Game Leaderboard Client

This is the Game Leaderboard client which is the frontend UI. It is written using [Next.js](https://nextjs.org) and sends requests to a GraphQL API.

## Development

```bash
# Install the dependencies
yarn install --dev

# Before running, you may want to update .env with an alternative API endpoint
# Run the site locally
yarn run dev
```

## Deploying on Cloudflare Pages

Firstly, you will need to fork this repository.

Next, simply head over to the [Cloudflare Dashboard](https://dash.cloudflare.com/), find Pages and create a new site using your repository.

After selecting your repository, fill in these settings:

- **Build Settings**
  - Build Command: `yarn run build-static`
  - Build Output Directory: `out`
- **Root Directory**
  - Path: `client`
- **Environment Variables**
  - Name: `NEXT_PUBLIC_API_ENDPOINT`, Value `https://game-leaderboard.jakew.workers.dev` (use your Worker URL here)

And that's it, wait for the site to build.
