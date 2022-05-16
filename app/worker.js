import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import { decodeCacheControl, encodeCacheControl } from "./utils";

const remixHandler = createRequestHandler(build, process.env.NODE_ENV);

async function cacheResponse(req, res) {
  const cacheControlHeader = res.headers.get("cache-control");
  if (!globalThis._CACHING && res.headers.has("etag") && cacheControlHeader) {
    const resp = res.clone();

    // copy SWR header to s-maxage so it survives in the cache
    if (cacheControlHeader.includes("stale-while-revalidate")) {
      const cc = decodeCacheControl(cacheControlHeader);
      cc["s-maxage"] = cc["stale-while-revalidate"];
      resp.headers.set("x-cached-at", new Date().toISOString());
      resp.headers.set("cache-control", encodeCacheControl(cc));
    }

    globalThis._CACHING = true;
    try {
      await caches.default.put(req, resp);
    } catch (e) {}
    globalThis._CACHING = false;
  }
}

export default {
  async fetch(req, env, ctx) {
    // assets
    const asset = await env.ASSETS.fetch(req);
    if (asset.status < 400) return asset;

    // cache
    if (req.headers.has("if-none-match")) {
      const cachedRes = await caches.default.match(req);
      const status = cachedRes?.headers.get("CF-Cache-status");
      if (status === "HIT") {
        const cachedAt = cachedRes.headers.get("x-cached-at");
        // SWR
        if (cachedAt) {
          const res = new Response(cachedRes.body, cachedRes);
          const cc = decodeCacheControl(res.headers.get("cache-control"));
          delete cc["s-maxage"];
          res.headers.delete("x-cached-at");
          res.headers.set("cache-control", encodeCacheControl(cc));
          const age = Math.ceil((Date.now() - Date.parse(cachedAt)) / 1000);
          if (age > cc["max-age"]) {
            res.headers.set("CF-Cache-Status", "UPDATING");
            if (!globalThis._UPDATING) {
              const update = async () => {
                globalThis._UPDATING = true;
                const res = await remixHandler(req, { env });
                await cacheResponse(req, res);
                globalThis._UPDATING = false;
              };
              ctx.waitUntil(update());
            }
          }
          return res;
        }
        return cachedRes;
      }
    }

    // remix
    const res = await remixHandler(req, { env });
    ctx.waitUntil(cacheResponse(req, res));
    return res;
  },
};

export { ExampleDO } from "./exampleDO";
