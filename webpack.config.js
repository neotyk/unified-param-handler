// webpack.config.js
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = env.production === true;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/main.js', // Entry point
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'unified-handler.min.js' : 'unified-handler.js',
      library: { // Expose the module's exports globally
        name: 'UnifiedParamHandler', // The global variable name (window.UnifiedParamHandler)
        type: 'umd', // Universal Module Definition - works everywhere
        export: 'default', // If main.js exports a default object
      },
      globalObject: 'this', // Important for UMD compatibility
      clean: true, // Clean the dist folder before build
    },
    devtool: isProduction ? false : 'inline-source-map', // Source maps for dev
    module: {
      rules: [
        {
          test: /\.js$/, // Apply babel-loader to all .js files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'] // Transpile based on browser targets
            }
          }
        }
      ]
    },
    optimization: {
      minimize: isProduction, // Minimize only in production
    },
    // (Optional) Add target for browser compatibility if needed
    // target: ['web', 'es5'], // Example: target older browsers
  };
};