module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  globals: {
    global: 'readonly',
    addHiddenInput: 'readonly',
    WEBPACK_BUILD_HAS_FIXED_CONFIG: 'readonly',
    WEBPACK_CUSTOM_CONFIGS: 'readonly',
    WEBPACK_CONFIG_NAME: 'readonly',
    WEBPACK_PACKAGE_VERSION: 'readonly',
    WEBPACK_BUILD_NAME: 'readonly',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
