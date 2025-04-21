// babel.config.js (Create this file in your project root if it doesn't exist)
module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current', // Crucial: Target the version of Node.js running Jest
          },
        },
      ],
    ],
    // Add any other plugins or presets needed for your source code here
    // e.g., if using React: presets: [['@babel/preset-env', ...], '@babel/preset-react']
  };