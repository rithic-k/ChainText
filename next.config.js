/** @type {import('next').NextConfig} */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes for Helia/IPFS in browser
    if (!isServer) {
      // Use node-polyfill-webpack-plugin for comprehensive polyfills
      config.plugins.push(
        new NodePolyfillPlugin({
          excludeAliases: ['console']
        })
      );
      
      // Additional fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        dgram: false,
        readline: false,
        'worker_threads': false,
        perf_hooks: false,
      };
    }
    
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = nextConfig;
