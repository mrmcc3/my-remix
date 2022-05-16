/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  assetsBuildDirectory: "public/static/build",
  publicPath: "/static/build/",
  ignoredRouteFiles: ["**/.*"],
  server: "app/worker.js",
  serverBuildPath: "public/_worker.js",
  serverBuildTarget: "cloudflare-pages",
  devServerBroadcastDelay: 300,
};
