// src/main.js
import { init } from './engine.js';

// Option 1: Immediately initialize with default config
// function run() { init(); }

// Option 2: Expose init globally to allow custom config injection (Recommended for flexibility)
function run() {
  // Expose the init function globally, perhaps namespaced
  window.UnifiedParamHandler = {
    init: init, // Allows calling UnifiedParamHandler.init(myCustomConfigs) from HTML
  };
  // Optionally, auto-initialize if no global config is detected after a short delay,
  // or just require manual initialization from the HTML.
  // For simplicity, we'll require manual init call from HTML when using custom config.
  // If you always want it to run with defaults unless overridden, you could do:
  if (!window.paramHandlerInitialized) {
    // Avoid double init
    // Check if a global config exists, otherwise use default by calling init()
    if (typeof window.handlerCustomConfigs !== 'undefined') {
      init(window.handlerCustomConfigs);
    } else {
      init(); // Initialize with defaults from config.js
    }
    window.paramHandlerInitialized = true;
  }
}

// DOM Ready check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run);
} else {
  run();
}
