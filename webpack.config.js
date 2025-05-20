// webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = (env, _argv) => {
  // Changed argv to _argv
  const isProduction = env.production === true;
  const configName = env.configName || null;
  const customConfigPath = env.customConfigPath || null;

  let customConfigsContent = null;
  let useCustomConfig = false;

  if (customConfigPath) {
    try {
      const resolvedPath = path.resolve(customConfigPath);
      customConfigsContent = require(resolvedPath);
      console.log(`Successfully loaded custom config from: ${resolvedPath}`);
      useCustomConfig = true; // Mark that custom config is successfully loaded
    } catch (e) {
      console.error(
        `Error loading custom config from ${customConfigPath}: ${e.message}`
      );
      // Proceed without custom config, customConfigsContent remains null
    }
  }

  const buildHasFixedConfig = useCustomConfig || !!configName;

  let filename;
  let outputConfigNamePart = configName;

  if (useCustomConfig && !configName) {
    outputConfigNamePart = 'custom';
  }

  if (isProduction) {
    filename = outputConfigNamePart
      ? `unified-handler.${outputConfigNamePart}.min.js`
      : 'unified-handler.min.js';
  } else {
    filename = outputConfigNamePart
      ? `unified-handler.${outputConfigNamePart}.js`
      : 'unified-handler.js';
  }

  const plugins = [
    new webpack.DefinePlugin({
      WEBPACK_CONFIG_NAME: JSON.stringify(configName),
      WEBPACK_CUSTOM_CONFIGS: JSON.stringify(customConfigsContent),
      WEBPACK_BUILD_HAS_FIXED_CONFIG: JSON.stringify(buildHasFixedConfig),
    }),
  ];

  if (useCustomConfig) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /src\/config\.js/, // Resource to replace
        path.resolve(__dirname, 'src/dummy-config.js') // New resource
      )
    );
    console.log(
      'Replaced src/config.js with src/dummy-config.js for this custom build.'
    );
  }

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: filename,
      library: {
        name: 'UnifiedParamHandler',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
      clean: true,
    },
    devtool: isProduction ? false : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: isProduction,
    },
    plugins: plugins, // Use the configured plugins array
    // target: ['web', 'es5'],
  };
};
