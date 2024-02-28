module.exports = function override(config, env) {
  // ... other config settings ...

  // Check if resolve.fallback needs to be created
  if (!config.resolve) {
    config.resolve = {};
  }

  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }

  // Add path-browserify as a fallback for the path module
  // First, you need to install path-browserify by running `npm install path-browserify`
  config.resolve.fallback.path = require.resolve('path-browserify');

  // Alternatively, set the path module to false if you don't need it
  // config.resolve.fallback.path = false;

  // If you had previously set fs to false, keep this line as well
  config.resolve.fallback.fs = false;

  // ... any other fallback settings or config adjustments ...

  return config;
};