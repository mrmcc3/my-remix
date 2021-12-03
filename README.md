## My Remix Template

There will be many remix starter templates. This one is mine!

Built for cloudflare workers. Tailwind styles

### Usage

`yarn dev`. http://localhost:8787

This starts **FOUR!** tools in watch mode concurrently. `tailwind`, `remix`, `esbuild` & `miniflare`.

This isn't ideal and usually leads to brittle development. There's an extra esbuild process to bundle
the worker which seems unnecessary when remix already uses esbuild. But it's early days and this was the best
approach I could find for getting fast feedback when tweaking UI.

`wrangler dev --inspect`. http://localhost:8787

This builds everything and deploys it to a cloudflare preview environment where you can open a chrome
devtools console to inspect the running worker. ATM it will only reload on changes in the `src/` directory.

`wrangler publish`. https://my-remix.michaels.workers.dev

This builds everything and deploys it to the default worker environment. Can be the `.workers.dev` domain
or a custom domain. See `wrangler.toml`.

`wrangler publish --env production`. https://my-remix-production.michaels.workers.dev

This builds everything and deploys it to a secondary worker environment (for example production).
See `wrangler.toml` for more details.

### Questions

#### Why not use the official remix cloudflare support?

Currently, it doesn't use the modules format which means you can't use durable objects which to me is one of the
most exciting/unique parts of the cloudflare worker offering. The other reason is exploration I wanted to
control the static asset caching and wire up remix manually to see how it works. 

#### Why use worker sites via wrangler and not cloudflare pages? Aren't CF pushing pages (they now have worker support) and steering users away from worker sites?

A few points purely my opinion. In its current state build/deploys on pages are painfully slow and while
I'm excited about their new support for workers `_worker.js` (which remix could target) and having
immutable deploys tied to Github (like Vercel) AFAIK they're missing things like secrets. 

It's just too early. It's not like workers sites are inferior in fact I would not be 
surprised if CF Pages is built on top of worker sites / kv-asset-handler.

#### Why wrangler v1 and not v2?

It's not ready yet. I'll update this when wrangler v2 is clearly the better choice.