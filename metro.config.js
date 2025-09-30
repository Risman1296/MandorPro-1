const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable source maps for now to fix the <anonymous> file issue
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Disable symbolication temporarily
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Skip symbolication requests that cause the <anonymous> file error
      if (req.url && req.url.includes('symbolicate')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ stack: [] }));
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;