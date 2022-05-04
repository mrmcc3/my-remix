import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { sha256Hex } from "./utils";

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("content-type", "text/html");
  if (
    process.env.NODE_ENV === "production" &&
    responseHeaders.get("cache-control")?.includes("max")
  ) {
    const hash = await sha256Hex(markup);
    responseHeaders.set("etag", `"${hash.substring(0, 8)}"`);
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
