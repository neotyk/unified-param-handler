// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json'); // Import package.json

module.exports = (env, _argv) => {
  // Changed argv to _argv
  const isProduction = env.production === true;
  const configFilterId = env.configName || null; // Used for WEBPACK_CONFIG_NAME for filtering
  const customConfigPath = env.customConfigPath || null;
  // Determine the primary name for the build output/log based on customConfigName first, then configName
  const buildIdentifier = env.customConfigName || env.configName || null;

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
    }
  }

  const buildHasFixedConfig =
    useCustomConfig || !!configFilterId || !!env.customConfigName;

  let filename;
  let outputConfigNamePart; // This is for the filename and WEBPACK_BUILD_NAME

  if (buildIdentifier) {
    outputConfigNamePart = buildIdentifier;
  } else if (useCustomConfig) {
    // If no specific buildIdentifier (from customConfigName or configName) but customConfigPath is used
    outputConfigNamePart = 'custom';
  } else {
    outputConfigNamePart = null;
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
      WEBPACK_CONFIG_NAME: JSON.stringify(configFilterId), // Still based on env.configName for filtering by ID
      WEBPACK_CUSTOM_CONFIGS: JSON.stringify(customConfigsContent),
      WEBPACK_BUILD_HAS_FIXED_CONFIG: JSON.stringify(buildHasFixedConfig),
      WEBPACK_PACKAGE_VERSION: JSON.stringify(packageJson.version),
      WEBPACK_BUILD_NAME: JSON.stringify(outputConfigNamePart), // Now correctly uses buildIdentifier
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
