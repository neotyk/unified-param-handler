// sc-config.js
// Custom configuration for "SC" version.
// Includes fbc, fbp, userAgent, and clientIp handlers.

// Assuming formatFbClickId is available in the execution scope if needed,
// or that the build process makes utils.js (or its relevant parts) available.
// For simplicity in this example, if formatFbClickId is from './utils.js'
// and this custom config is loaded by Webpack, direct import might not work
// unless Webpack is configured to resolve it relative to this file or it's globally available.
// However, the current webpack setup injects this as a JSON object, so functions need to be handled carefully.
// For now, we'll include it as if it were a string placeholder or assume it's globally defined by the main bundle.
// A better approach for functions in custom configs might be to define them directly here or
// ensure they are part of the core bundle and callable.

// For the 'fbc' config, 'applyFormatting: formatFbClickId' is tricky when this is pure JSON.
// Let's assume for a build process, we might stringify the function or handle it.
// Given the current DefinePlugin approach, functions won't transfer directly.
// The engine.js would need to be aware of this and potentially map string identifiers to actual functions.

// Workaround: The 'applyFormatting' property might need to be omitted if it can't be resolved,
// or the main 'engine.js' could be adapted to look up known formatters by string name if WEBPACK_CUSTOM_CONFIGS is used.

// For this example, I will copy the structures as closely as possible.
// The 'formatFbClickId' function reference will likely not work as-is when injected via DefinePlugin
// unless your main 'engine.js' has a way to re-hydrate it or the function is globally available.

export default [
  // --- Facebook Handlers ---
  {
    id: 'fbc',
    sourceType: 'url_or_cookie',
    urlParamName: 'fbclid',
    cookieName: '_fbc',
    targetInputName: 'field11', // CS-specific target name
    applyFormatting: 'formatFbClickId', // Using string name for the formatter
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: '_fbc',
      daysToExpiry: 90,
    },
    retryMechanism: {
      enabled: true,
      maxAttempts: 5,
      interval: 5000,
    },
  },
  {
    id: 'fbp',
    sourceType: 'cookie',
    cookieName: '_fbp',
    targetInputName: 'field10', // Assuming this should be field10 for an sc-config
    retryMechanism: {
      enabled: true,
      maxAttempts: 5,
      interval: 5000,
    },
  },

  // --- Browser/Client Info ---
  {
    id: 'userAgent',
    sourceType: 'user_agent',
    targetInputName: 'field13', // Assuming this should be field13
  },
  {
    id: 'clientIp',
    sourceType: 'ip_address',
    targetInputName: 'field12', // Assuming this should be field12
  },
];
