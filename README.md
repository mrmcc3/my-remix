## My Remix

A Template using Remix & Tailwind targeting Cloudflare Workers & Pages. With demos 
showcasing [KV storage](https://my-remix.pages.dev/kv)
and [durable objects](https://my-remix.pages.dev/do/the-one) with remix.

The same remix code can be deployed as a [worker site](https://developers.cloudflare.com/workers/platform/sites)
using [wrangler v1](https://github.com/cloudflare/wrangler). Or using [Cloudflare Pages](https://developers.cloudflare.com/pages/)
new support for [functions](https://developers.cloudflare.com/pages/platform/functions#advanced-mode).

Each deployment target has a preview and production environment. For example:

- [https://my-remix.michaels.workers.dev](https://my-remix.michaels.workers.dev) - worker sites development, deployed with `wrangler publish`
- [https://my-remix-production.michaels.workers.dev](https://my-remix-production.michaels.workers.dev) - worker sites production, deployed with `wrangler publish --env production`
- `https://<branch>.my-remix.pages.dev` - pages preview. deployed on push to any branch other then main
- [https://my-remix.pages.dev](https://my-remix.pages.dev) - pages production. deployed on push to main branch

Some setup is required.

- Create KV namespaces with wrangler or via the cloudflare dashboard
- Update configuration in `wrangler.toml`
- Create DO namespaces with `wrangler publish --new-class ExampleDO`
- Initialize cloudflare pages from the dashboard.
    - pick the github repo
    - setup the KV and DO bindings
    - add any environment vars.

### FAQs

#### Why not use the official remix cloudflare support?
Currently, it doesn't use the modules format which means you can't use
durable objects which to me is one of the most exciting/unique parts of the
cloudflare worker offering. The other reason is exploration, I wanted to
control the static asset caching and wire up remix manually to see how it works.

**NOTE** currently this does mean cookie signing and remix sessions don't work. It's
early days, as cloudflare and remix evolve I'm sure it'll get better.

#### Why target both Cloudflare Pages and Worker Sites.

A few points purely my opinion. In its current state build/deploys on pages are painfully
slow and while I'm excited about their new support for workers and having immutable deploys
tied to Github (like Vercel) it seems they're missing support for encrypted secrets and
a way to create durable objects in the first place.

It's just too early. Worker sites via wrangler seems more production ready. It's not like
workers sites are inferior in fact I would not be surprised if CF Pages is built on top of
worker sites / kv-asset-handler.

#### Why wrangler v1 and not v2?

It's not ready yet. I'll update this when wrangler v2 is clearly the better choice.

