/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes for IPFS and OrbitDB in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        child_process: false,
        dns: false,
        dgram: false,
        readline: false,
        'worker_threads': false,
        perf_hooks: false,
        buffer: require.resolve('buffer/'),
      };
      
      // Add Buffer polyfill
      config.plugins.push(
        new (require('webpack')).ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }
    
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Ignore node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:buffer': 'buffer',
      'node:crypto': 'crypto-browserify',
      'node:stream': 'stream-browserify',
    };

    return config;
  },
};

module.exports = nextConfig;
