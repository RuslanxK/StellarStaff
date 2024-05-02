const { resolve } = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = { "os": require.resolve("os-browserify/browser") };
  return config;
}
