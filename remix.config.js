const isCF = process.env.CF_PAGES === '1'

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  assetsBuildDirectory: 'public/static/build',
  publicPath: '/static/build/',
  ignoredRouteFiles: ['**/.*'],
  serverBuildPath: isCF ? 'public/_worker.js' : '.cache/dev.js',
  server: isCF ? 'app/worker.js' : undefined,
  serverBuildTarget: isCF ? 'cloudflare-pages' : 'node-cjs'
}
