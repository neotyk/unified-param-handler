(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["UnifiedParamHandler"] = factory();
	else
		root["UnifiedParamHandler"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handlerConfigs: () => (/* binding */ handlerConfigs)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
// src/config.js
 // Import needed functions

/**
 * Central configuration array. Each object defines how to handle one parameter/cookie.
 *
 * Properties for each config object:
 * - id: (string) Unique internal identifier (e.g., 'fbc', 'gclid', 'utm_source'). Used mainly for logging.
 * - sourceType: (string) Where to look for the value:
 *     - 'url': Check URL query parameters only.
 *     - 'cookie': Check document cookies only.
 *     - 'url_or_cookie': Check URL first, then cookie if not found in URL.
 * - urlParamName: (string) [Required if sourceType includes 'url'] The exact name of the URL query parameter.
 * - cookieName: (string) [Required if sourceType includes 'cookie'] The exact name of the cookie.
 * - targetInputName: (string) [Required] The 'name' attribute of the target hidden input field.
 * - applyFormatting: (function) [Optional] A function to format the raw value before setting it. Receives the raw value as input.
 * - setCookie: (object) [Optional] Configuration for setting/updating a cookie.
 *     - enabledOnUrlHit: (boolean) Set the cookie if the value was found in the URL?
 *     - cookieNameToSet: (string) The name of the cookie to set/update.
 *     - daysToExpiry: (number) Lifespan of the cookie in days.
 * - retryMechanism: (object) [Optional, only applies if sourceType includes 'cookie'] Configuration for retrying cookie reads.
 *     - enabled: (boolean) Enable retry if cookie not found initially?
 *     - maxAttempts: (number) Maximum number of retry attempts.
 *     - interval: (number) Delay between retries in milliseconds.
 */
var handlerConfigs = [
// --- Facebook Handlers ---
{
  id: 'fbc',
  sourceType: 'url_or_cookie',
  urlParamName: 'fbclid',
  cookieName: '_fbc',
  targetInputName: 'custom FBC',
  // Example name, adjust as needed
  applyFormatting: _utils_js__WEBPACK_IMPORTED_MODULE_0__.formatFbClickId,
  // Reference to the formatting function
  setCookie: {
    enabledOnUrlHit: true,
    cookieNameToSet: '_fbc',
    daysToExpiry: 90
  },
  retryMechanism: {
    enabled: true,
    maxAttempts: 5,
    interval: 5000
  }
}, {
  id: 'fbp',
  sourceType: 'cookie',
  cookieName: '_fbp',
  targetInputName: 'custom FBP',
  // Example name, adjust as needed
  retryMechanism: {
    enabled: true,
    maxAttempts: 5,
    interval: 5000
  }
},
// --- Google Handlers ---
{
  id: 'gclid',
  sourceType: 'url',
  urlParamName: 'gclid',
  targetInputName: 'custom GCLID',
  // Example name, adjust as needed
  setCookie: {
    enabledOnUrlHit: true,
    cookieNameToSet: 'gclid',
    daysToExpiry: 90
  }
}, {
  id: 'wbraid',
  sourceType: 'url',
  urlParamName: 'wbraid',
  targetInputName: 'custom WBRAID',
  // Example name, adjust as needed
  setCookie: {
    enabledOnUrlHit: true,
    cookieNameToSet: 'wbraid',
    daysToExpiry: 90
  }
}, {
  id: 'gbraid',
  sourceType: 'url',
  urlParamName: 'gbraid',
  targetInputName: 'custom GBRAID',
  // Example name, adjust as needed
  setCookie: {
    enabledOnUrlHit: true,
    cookieNameToSet: 'gbraid',
    daysToExpiry: 90
  }
},
// --- UTM Handlers ---
{
  id: 'utm_source',
  sourceType: 'url',
  urlParamName: 'utm_source',
  targetInputName: 'custom UTM_SOURCE'
}, {
  id: 'utm_medium',
  sourceType: 'url',
  urlParamName: 'utm_medium',
  targetInputName: 'custom UTM_MEDIUM'
}, {
  id: 'utm_campaign',
  sourceType: 'url',
  urlParamName: 'utm_campaign',
  targetInputName: 'custom UTM_CAMPAIGN'
}, {
  id: 'utm_term',
  sourceType: 'url',
  urlParamName: 'utm_term',
  targetInputName: 'custom UTM_TERM'
}, {
  id: 'utm_content',
  sourceType: 'url',
  urlParamName: 'utm_content',
  targetInputName: 'custom UTM_CONTENT'
}, {
  id: 'utm_id',
  sourceType: 'url',
  urlParamName: 'utm_id',
  targetInputName: 'custom UTM_ID'
}, {
  id: 'utm_pub',
  sourceType: 'url',
  urlParamName: 'utm_pub',
  targetInputName: 'custom UTM_PUB'
}, {
  id: 'utm_size',
  sourceType: 'url',
  urlParamName: 'utm_size',
  targetInputName: 'custom UTM_SIZE'
}, {
  id: 'utm_broker',
  sourceType: 'url',
  urlParamName: 'utm_broker',
  targetInputName: 'custom UTM_BROKER'
}
// Add more UTMs or other parameters here following the pattern
];

/***/ }),

/***/ "./src/engine.js":
/*!***********************!*\
  !*** ./src/engine.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ "./src/config.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// src/engine.js



/**
 * Waits for a specific cookie and updates the input field if found.
 * This is called ONLY when the initial check fails and retry is enabled.
 *
 * @param {string} cookieName Name of the cookie to wait for.
 * @param {HTMLElement} inputElement The actual DOM element of the target input.
 * @param {object} retryConfig The retryMechanism part of the handler config.
 * @param {number} initialAttemptCount The starting attempt number (usually 1).
 */
function waitForCookieAndUpdateInput(cookieName, inputElement, retryConfig) {
  var initialAttemptCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var attempts = initialAttemptCount;
  var maxAttempts = retryConfig.maxAttempts || 5;
  var interval = retryConfig.interval || 5000;
  function checkCookieWithRetry() {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.startGroup("Retrying for ".concat(cookieName, " Cookie (Attempt ").concat(attempts, "/").concat(maxAttempts, ")"), true);
    var cookieValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getCookie(cookieName); // Get fresh cookies

    if (cookieValue) {
      // --- Cookie Found on Retry ---
      inputElement.value = cookieValue;
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Input field '".concat(inputElement.name, "' updated from RETRIED cookie '").concat(cookieName, "':"), cookieValue);
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup();
      return; // Success: Stop retrying.
    }

    // --- Cookie Not Found ---
    attempts++;
    if (attempts > maxAttempts) {
      // --- Max Attempts Reached ---
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError("Failed to find ".concat(cookieName, " cookie after ").concat(maxAttempts, " total attempts. Input field '").concat(inputElement.name, "' might remain empty or unchanged."));
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup();
      return; // Failure: Stop retrying.
    }

    // --- Schedule Next Attempt ---
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Cookie ".concat(cookieName, " still not found. Will retry again in ").concat(interval / 1000, " seconds."));
    setTimeout(checkCookieWithRetry, interval);
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup();
  }

  // Start the first retry check (via setTimeout)
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Cookie ".concat(cookieName, " not found initially. Starting retry checks (Attempt ").concat(attempts, ")."));
  setTimeout(checkCookieWithRetry, interval);
}

/**
 * Processes a single configuration object from the handlerConfigs array.
 * Finds values from URL/cookie, formats, updates input, sets cookies, and initiates retry if needed.
 * @param {object} config A single configuration object from `handlerConfigs`.
 */
function processHandler(config, inputElement) {
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.startGroup("Processing Handler: ".concat(config.id), true);
  if (!inputElement) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError("Target input field '".concat(config.targetInputName, "' for handler '").concat(config.id, "' not found. Skipping."));
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup();
    return; // Cannot proceed without the target input
  }
  var rawValue = null;
  var valueSource = null; // 'url' or 'cookie'

  // 1. Check URL Source
  if (config.sourceType.includes('url') && config.urlParamName) {
    rawValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS.get(config.urlParamName);
    if (rawValue !== null) {
      valueSource = 'url';
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Found raw value for '".concat(config.id, "' in URL ('").concat(config.urlParamName, "'):"), rawValue);
    }
  }

  // 2. Check Cookie Source (if not found in URL or if source is only cookie)
  if (rawValue === null && config.sourceType.includes('cookie') && config.cookieName) {
    rawValue = _utils_js__WEBPACK_IMPORTED_MODULE_0__.getCookie(config.cookieName); // Gets fresh cookies
    if (rawValue !== null) {
      valueSource = 'cookie';
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Found raw value for '".concat(config.id, "' in Cookie ('").concat(config.cookieName, "'):"), rawValue);
    }
  }

  // 3. Process Found Value (or handle not found)
  if (rawValue !== null) {
    var finalValue = rawValue;

    // 3a. Apply Formatting (if configured and value exists)
    if (typeof config.applyFormatting === 'function') {
      try {
        var formatted = config.applyFormatting(rawValue);
        if (formatted !== null && formatted !== undefined) {
          finalValue = formatted;
          _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Formatted value for '".concat(config.id, "':"), finalValue);
        } else {
          _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Formatting function for '".concat(config.id, "' returned null/undefined. Using raw value."));
          finalValue = rawValue; // Fallback to raw if formatter returns nothing useful
        }
      } catch (formatError) {
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError("Error applying formatting function for handler '".concat(config.id, "': ").concat(formatError.message, ". Using raw value."));
        finalValue = rawValue; // Use raw value on error
      }
    }

    // 3b. Update Input Field
    inputElement.value = finalValue;
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Input field '".concat(config.targetInputName, "' updated for '").concat(config.id, "'. Value Source: ").concat(valueSource, "."));

    // 3c. Set Cookie (if configured for URL hit and value came from URL)
    if (valueSource === 'url' && config.setCookie && config.setCookie.enabledOnUrlHit) {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.setCookie(config.setCookie.cookieNameToSet, finalValue,
      // Use the potentially formatted value for the cookie
      config.setCookie.daysToExpiry);
    }
  } else {
    // 4. Value Not Found - Initiate Retry or Clear Input
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("No initial value found for '".concat(config.id, "' from configured sources (").concat(config.sourceType, ")."));
    if (config.sourceType.includes('cookie') && config.retryMechanism && config.retryMechanism.enabled) {
      // Initiate retry only if cookie was a potential source and retry is enabled
      waitForCookieAndUpdateInput(config.cookieName, inputElement, config.retryMechanism, 1 // Start counting attempts from 1 for retry
      );
    } else {
      // No retry configured or applicable, ensure input is empty
      if (inputElement.value !== '') {
        // Only log if we are changing it
        inputElement.value = '';
        _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug("Ensured input field '".concat(config.targetInputName, "' for '").concat(config.id, "' is empty (value not found and no retry)."));
      }
    }
  }
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup(); // End processing group for this handler
}

// Define the main initialization function
function init(customConfigs) {
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.startGroup('Initializing Unified Parameter Handler');
  var configsToUse = Array.isArray(customConfigs) && customConfigs.length > 0 ? customConfigs : _config_js__WEBPACK_IMPORTED_MODULE_1__.defaultHandlerConfigs; // Use custom config if valid, else default

  _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug('Using configurations:', configsToUse);
  if (!Array.isArray(configsToUse) || configsToUse.length === 0) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError('Handler configurations are missing or empty.');
    _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup();
    return;
  }
  configsToUse.forEach(function (config) {
    // Basic validation
    if (!config || _typeof(config) !== 'object' || !config.id || !config.sourceType || !config.targetInputName) {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError("Invalid handler config: ".concat(JSON.stringify(config)));
      return;
    }
    var inputElement = document.querySelector("input[name=\"".concat(config.targetInputName, "\"]"));
    if (!inputElement) {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError("Target input '".concat(config.targetInputName, "' for '").concat(config.id, "' not found. Skipping."));
      return;
    }
    try {
      processHandler(config, inputElement); // Pass element
    } catch (error) {
      _utils_js__WEBPACK_IMPORTED_MODULE_0__.logError("Unexpected error processing handler '".concat(config.id, "': ").concat(error.message));
      console.error(error); // Log full stack trace for unexpected errors
    }
  });
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.logDebug('Finished processing configurations.');
  _utils_js__WEBPACK_IMPORTED_MODULE_0__.endGroup();
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEBUG_MODE: () => (/* binding */ DEBUG_MODE),
/* harmony export */   URL_PARAMS: () => (/* binding */ URL_PARAMS),
/* harmony export */   endGroup: () => (/* binding */ endGroup),
/* harmony export */   formatFbClickId: () => (/* binding */ formatFbClickId),
/* harmony export */   getCookie: () => (/* binding */ getCookie),
/* harmony export */   getSubdomainIndex: () => (/* binding */ getSubdomainIndex),
/* harmony export */   logDebug: () => (/* binding */ logDebug),
/* harmony export */   logError: () => (/* binding */ logError),
/* harmony export */   parseCookies: () => (/* binding */ parseCookies),
/* harmony export */   setCookie: () => (/* binding */ setCookie),
/* harmony export */   startGroup: () => (/* binding */ startGroup)
/* harmony export */ });
// src/utils.js
var DEBUG_MODE = window.location.search.includes('debug=true');
var URL_PARAMS = new URLSearchParams(window.location.search);
function logError(message) {
  console.error("[Unified Param Handler Error]: ".concat(message));
  // Removed alert fallback - generally not desired for production scripts
}
function logDebug(message) {
  if (DEBUG_MODE && typeof console !== 'undefined' && console.log) {
    var _console;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    (_console = console).log.apply(_console, ["[Unified Param Handler] ".concat(message)].concat(args));
  }
}
function startGroup(name) {
  var collapsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (DEBUG_MODE && typeof console !== 'undefined') {
    var groupMethod = collapsed ? console.groupCollapsed : console.group;
    if (groupMethod) {
      groupMethod("[Unified Param Handler] ".concat(name));
    }
  }
}
function endGroup() {
  if (DEBUG_MODE && typeof console !== 'undefined' && console.groupEnd) {
    console.groupEnd();
  }
}
function parseCookies() {
  startGroup('Parsing Cookies', true);
  var cookies = {};
  if (document.cookie && document.cookie !== '') {
    document.cookie.split(';').forEach(function (cookie) {
      var eqPos = cookie.indexOf('=');
      if (eqPos > 0) {
        // Ensure '=' is found and not the first char
        var name = cookie.substring(0, eqPos).trim();
        var value = cookie.substring(eqPos + 1).trim();
        // Decode cookie value, handle potential quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        try {
          cookies[name] = decodeURIComponent(value);
        } catch (e) {
          cookies[name] = value; // Fallback to raw value if decoding fails
          logError("Failed to decode cookie \"".concat(name, "\": ").concat(e.message));
        }
      }
    });
  }
  logDebug('Parsed cookies:', cookies);
  endGroup();
  return cookies;
}
function getCookie(name) {
  // Always parse fresh cookies
  var currentCookies = parseCookies();
  logDebug("Getting cookie '".concat(name, "':"), currentCookies[name]);
  return currentCookies[name] || null;
}
function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  // Encode the value for safety
  var encodedValue = encodeURIComponent(value);
  document.cookie = name + '=' + encodedValue + expires + '; path=/; SameSite=Lax'; // Added SameSite=Lax for good practice
  logDebug("Cookie set: ".concat(name, " = ").concat(value, " (Expires in ").concat(days, " days)"));
}
function getSubdomainIndex() {
  var hostname = window.location.hostname;
  // Basic check for localhost or IP - might need refinement for edge cases
  if (hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return 1; // Default for local/IP
  }
  if (hostname === 'com') return 0; // Original check
  var parts = hostname.split('.');
  // Handle cases like example.com (length 2 -> index 1)
  // and www.example.com (length 3 -> index 2)
  // Consider TLDs like .co.uk - this simple logic might need adjustment if specific FB requirements differ.
  return Math.max(1, parts.length - 1); // Ensure at least 1
}
function formatFbClickId(fbclid) {
  if (!fbclid) return null;
  var subdomainIndex = getSubdomainIndex();
  var creationTime = Date.now();
  return "fb.".concat(subdomainIndex, ".").concat(creationTime, ".").concat(fbclid);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine.js */ "./src/engine.js");
// src/main.js


// Option 1: Immediately initialize with default config
// function run() { init(); }

// Option 2: Expose init globally to allow custom config injection (Recommended for flexibility)
function run() {
  // Expose the init function globally, perhaps namespaced
  window.UnifiedParamHandler = {
    init: _engine_js__WEBPACK_IMPORTED_MODULE_0__.init // Allows calling UnifiedParamHandler.init(myCustomConfigs) from HTML
  };
  // Optionally, auto-initialize if no global config is detected after a short delay,
  // or just require manual initialization from the HTML.
  // For simplicity, we'll require manual init call from HTML when using custom config.
  // If you always want it to run with defaults unless overridden, you could do:
  if (!window.paramHandlerInitialized) {
    // Avoid double init
    // Check if a global config exists, otherwise use default by calling init()
    if (typeof window.handlerCustomConfigs !== 'undefined') {
      (0,_engine_js__WEBPACK_IMPORTED_MODULE_0__.init)(window.handlerCustomConfigs);
    } else {
      (0,_engine_js__WEBPACK_IMPORTED_MODULE_0__.init)(); // Initialize with defaults from config.js
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
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDcEQsQ0FBQyxNQUFNO0VBQ0xBLEdBQUcsQ0FBQyxDQUFDO0FBQ1AsQyIsInNvdXJjZXMiOlsid2VicGFjazovL1VuaWZpZWRQYXJhbUhhbmRsZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1VuaWZpZWRQYXJhbUhhbmRsZXIvLi9zcmMvY29uZmlnLmpzIiwid2VicGFjazovL1VuaWZpZWRQYXJhbUhhbmRsZXIvLi9zcmMvZW5naW5lLmpzIiwid2VicGFjazovL1VuaWZpZWRQYXJhbUhhbmRsZXIvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vVW5pZmllZFBhcmFtSGFuZGxlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9VbmlmaWVkUGFyYW1IYW5kbGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9VbmlmaWVkUGFyYW1IYW5kbGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vVW5pZmllZFBhcmFtSGFuZGxlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1VuaWZpZWRQYXJhbUhhbmRsZXIvLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJVbmlmaWVkUGFyYW1IYW5kbGVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlVuaWZpZWRQYXJhbUhhbmRsZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gc3JjL2NvbmZpZy5qc1xuaW1wb3J0IHsgZm9ybWF0RmJDbGlja0lkIH0gZnJvbSAnLi91dGlscy5qcyc7IC8vIEltcG9ydCBuZWVkZWQgZnVuY3Rpb25zXG5cbi8qKlxuICogQ2VudHJhbCBjb25maWd1cmF0aW9uIGFycmF5LiBFYWNoIG9iamVjdCBkZWZpbmVzIGhvdyB0byBoYW5kbGUgb25lIHBhcmFtZXRlci9jb29raWUuXG4gKlxuICogUHJvcGVydGllcyBmb3IgZWFjaCBjb25maWcgb2JqZWN0OlxuICogLSBpZDogKHN0cmluZykgVW5pcXVlIGludGVybmFsIGlkZW50aWZpZXIgKGUuZy4sICdmYmMnLCAnZ2NsaWQnLCAndXRtX3NvdXJjZScpLiBVc2VkIG1haW5seSBmb3IgbG9nZ2luZy5cbiAqIC0gc291cmNlVHlwZTogKHN0cmluZykgV2hlcmUgdG8gbG9vayBmb3IgdGhlIHZhbHVlOlxuICogICAgIC0gJ3VybCc6IENoZWNrIFVSTCBxdWVyeSBwYXJhbWV0ZXJzIG9ubHkuXG4gKiAgICAgLSAnY29va2llJzogQ2hlY2sgZG9jdW1lbnQgY29va2llcyBvbmx5LlxuICogICAgIC0gJ3VybF9vcl9jb29raWUnOiBDaGVjayBVUkwgZmlyc3QsIHRoZW4gY29va2llIGlmIG5vdCBmb3VuZCBpbiBVUkwuXG4gKiAtIHVybFBhcmFtTmFtZTogKHN0cmluZykgW1JlcXVpcmVkIGlmIHNvdXJjZVR5cGUgaW5jbHVkZXMgJ3VybCddIFRoZSBleGFjdCBuYW1lIG9mIHRoZSBVUkwgcXVlcnkgcGFyYW1ldGVyLlxuICogLSBjb29raWVOYW1lOiAoc3RyaW5nKSBbUmVxdWlyZWQgaWYgc291cmNlVHlwZSBpbmNsdWRlcyAnY29va2llJ10gVGhlIGV4YWN0IG5hbWUgb2YgdGhlIGNvb2tpZS5cbiAqIC0gdGFyZ2V0SW5wdXROYW1lOiAoc3RyaW5nKSBbUmVxdWlyZWRdIFRoZSAnbmFtZScgYXR0cmlidXRlIG9mIHRoZSB0YXJnZXQgaGlkZGVuIGlucHV0IGZpZWxkLlxuICogLSBhcHBseUZvcm1hdHRpbmc6IChmdW5jdGlvbikgW09wdGlvbmFsXSBBIGZ1bmN0aW9uIHRvIGZvcm1hdCB0aGUgcmF3IHZhbHVlIGJlZm9yZSBzZXR0aW5nIGl0LiBSZWNlaXZlcyB0aGUgcmF3IHZhbHVlIGFzIGlucHV0LlxuICogLSBzZXRDb29raWU6IChvYmplY3QpIFtPcHRpb25hbF0gQ29uZmlndXJhdGlvbiBmb3Igc2V0dGluZy91cGRhdGluZyBhIGNvb2tpZS5cbiAqICAgICAtIGVuYWJsZWRPblVybEhpdDogKGJvb2xlYW4pIFNldCB0aGUgY29va2llIGlmIHRoZSB2YWx1ZSB3YXMgZm91bmQgaW4gdGhlIFVSTD9cbiAqICAgICAtIGNvb2tpZU5hbWVUb1NldDogKHN0cmluZykgVGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBzZXQvdXBkYXRlLlxuICogICAgIC0gZGF5c1RvRXhwaXJ5OiAobnVtYmVyKSBMaWZlc3BhbiBvZiB0aGUgY29va2llIGluIGRheXMuXG4gKiAtIHJldHJ5TWVjaGFuaXNtOiAob2JqZWN0KSBbT3B0aW9uYWwsIG9ubHkgYXBwbGllcyBpZiBzb3VyY2VUeXBlIGluY2x1ZGVzICdjb29raWUnXSBDb25maWd1cmF0aW9uIGZvciByZXRyeWluZyBjb29raWUgcmVhZHMuXG4gKiAgICAgLSBlbmFibGVkOiAoYm9vbGVhbikgRW5hYmxlIHJldHJ5IGlmIGNvb2tpZSBub3QgZm91bmQgaW5pdGlhbGx5P1xuICogICAgIC0gbWF4QXR0ZW1wdHM6IChudW1iZXIpIE1heGltdW0gbnVtYmVyIG9mIHJldHJ5IGF0dGVtcHRzLlxuICogICAgIC0gaW50ZXJ2YWw6IChudW1iZXIpIERlbGF5IGJldHdlZW4gcmV0cmllcyBpbiBtaWxsaXNlY29uZHMuXG4gKi9cbmV4cG9ydCBjb25zdCBoYW5kbGVyQ29uZmlncyA9IFtcbiAgLy8gLS0tIEZhY2Vib29rIEhhbmRsZXJzIC0tLVxuICB7XG4gICAgaWQ6ICdmYmMnLFxuICAgIHNvdXJjZVR5cGU6ICd1cmxfb3JfY29va2llJyxcbiAgICB1cmxQYXJhbU5hbWU6ICdmYmNsaWQnLFxuICAgIGNvb2tpZU5hbWU6ICdfZmJjJyxcbiAgICB0YXJnZXRJbnB1dE5hbWU6ICdjdXN0b20gRkJDJywgLy8gRXhhbXBsZSBuYW1lLCBhZGp1c3QgYXMgbmVlZGVkXG4gICAgYXBwbHlGb3JtYXR0aW5nOiBmb3JtYXRGYkNsaWNrSWQsIC8vIFJlZmVyZW5jZSB0byB0aGUgZm9ybWF0dGluZyBmdW5jdGlvblxuICAgIHNldENvb2tpZToge1xuICAgICAgZW5hYmxlZE9uVXJsSGl0OiB0cnVlLFxuICAgICAgY29va2llTmFtZVRvU2V0OiAnX2ZiYycsXG4gICAgICBkYXlzVG9FeHBpcnk6IDkwLFxuICAgIH0sXG4gICAgcmV0cnlNZWNoYW5pc206IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBtYXhBdHRlbXB0czogNSxcbiAgICAgIGludGVydmFsOiA1MDAwLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZicCcsXG4gICAgc291cmNlVHlwZTogJ2Nvb2tpZScsXG4gICAgY29va2llTmFtZTogJ19mYnAnLFxuICAgIHRhcmdldElucHV0TmFtZTogJ2N1c3RvbSBGQlAnLCAvLyBFeGFtcGxlIG5hbWUsIGFkanVzdCBhcyBuZWVkZWRcbiAgICByZXRyeU1lY2hhbmlzbToge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIG1heEF0dGVtcHRzOiA1LFxuICAgICAgaW50ZXJ2YWw6IDUwMDAsXG4gICAgfSxcbiAgfSxcblxuICAvLyAtLS0gR29vZ2xlIEhhbmRsZXJzIC0tLVxuICB7XG4gICAgaWQ6ICdnY2xpZCcsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAnZ2NsaWQnLFxuICAgIHRhcmdldElucHV0TmFtZTogJ2N1c3RvbSBHQ0xJRCcsIC8vIEV4YW1wbGUgbmFtZSwgYWRqdXN0IGFzIG5lZWRlZFxuICAgIHNldENvb2tpZToge1xuICAgICAgZW5hYmxlZE9uVXJsSGl0OiB0cnVlLFxuICAgICAgY29va2llTmFtZVRvU2V0OiAnZ2NsaWQnLFxuICAgICAgZGF5c1RvRXhwaXJ5OiA5MCxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgaWQ6ICd3YnJhaWQnLFxuICAgIHNvdXJjZVR5cGU6ICd1cmwnLFxuICAgIHVybFBhcmFtTmFtZTogJ3dicmFpZCcsXG4gICAgdGFyZ2V0SW5wdXROYW1lOiAnY3VzdG9tIFdCUkFJRCcsIC8vIEV4YW1wbGUgbmFtZSwgYWRqdXN0IGFzIG5lZWRlZFxuICAgIHNldENvb2tpZToge1xuICAgICAgZW5hYmxlZE9uVXJsSGl0OiB0cnVlLFxuICAgICAgY29va2llTmFtZVRvU2V0OiAnd2JyYWlkJyxcbiAgICAgIGRheXNUb0V4cGlyeTogOTAsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIGlkOiAnZ2JyYWlkJyxcbiAgICBzb3VyY2VUeXBlOiAndXJsJyxcbiAgICB1cmxQYXJhbU5hbWU6ICdnYnJhaWQnLFxuICAgIHRhcmdldElucHV0TmFtZTogJ2N1c3RvbSBHQlJBSUQnLCAvLyBFeGFtcGxlIG5hbWUsIGFkanVzdCBhcyBuZWVkZWRcbiAgICBzZXRDb29raWU6IHtcbiAgICAgIGVuYWJsZWRPblVybEhpdDogdHJ1ZSxcbiAgICAgIGNvb2tpZU5hbWVUb1NldDogJ2dicmFpZCcsXG4gICAgICBkYXlzVG9FeHBpcnk6IDkwLFxuICAgIH0sXG4gIH0sXG5cbiAgLy8gLS0tIFVUTSBIYW5kbGVycyAtLS1cbiAge1xuICAgIGlkOiAndXRtX3NvdXJjZScsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAndXRtX3NvdXJjZScsXG4gICAgdGFyZ2V0SW5wdXROYW1lOiAnY3VzdG9tIFVUTV9TT1VSQ0UnLFxuICB9LFxuICB7XG4gICAgaWQ6ICd1dG1fbWVkaXVtJyxcbiAgICBzb3VyY2VUeXBlOiAndXJsJyxcbiAgICB1cmxQYXJhbU5hbWU6ICd1dG1fbWVkaXVtJyxcbiAgICB0YXJnZXRJbnB1dE5hbWU6ICdjdXN0b20gVVRNX01FRElVTScsXG4gIH0sXG4gIHtcbiAgICBpZDogJ3V0bV9jYW1wYWlnbicsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAndXRtX2NhbXBhaWduJyxcbiAgICB0YXJnZXRJbnB1dE5hbWU6ICdjdXN0b20gVVRNX0NBTVBBSUdOJyxcbiAgfSxcbiAge1xuICAgIGlkOiAndXRtX3Rlcm0nLFxuICAgIHNvdXJjZVR5cGU6ICd1cmwnLFxuICAgIHVybFBhcmFtTmFtZTogJ3V0bV90ZXJtJyxcbiAgICB0YXJnZXRJbnB1dE5hbWU6ICdjdXN0b20gVVRNX1RFUk0nLFxuICB9LFxuICB7XG4gICAgaWQ6ICd1dG1fY29udGVudCcsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAndXRtX2NvbnRlbnQnLFxuICAgIHRhcmdldElucHV0TmFtZTogJ2N1c3RvbSBVVE1fQ09OVEVOVCcsXG4gIH0sXG4gIHtcbiAgICBpZDogJ3V0bV9pZCcsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAndXRtX2lkJyxcbiAgICB0YXJnZXRJbnB1dE5hbWU6ICdjdXN0b20gVVRNX0lEJyxcbiAgfSxcbiAge1xuICAgIGlkOiAndXRtX3B1YicsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAndXRtX3B1YicsXG4gICAgdGFyZ2V0SW5wdXROYW1lOiAnY3VzdG9tIFVUTV9QVUInLFxuICB9LFxuICB7XG4gICAgaWQ6ICd1dG1fc2l6ZScsXG4gICAgc291cmNlVHlwZTogJ3VybCcsXG4gICAgdXJsUGFyYW1OYW1lOiAndXRtX3NpemUnLFxuICAgIHRhcmdldElucHV0TmFtZTogJ2N1c3RvbSBVVE1fU0laRScsXG4gIH0sXG4gIHtcbiAgICBpZDogJ3V0bV9icm9rZXInLFxuICAgIHNvdXJjZVR5cGU6ICd1cmwnLFxuICAgIHVybFBhcmFtTmFtZTogJ3V0bV9icm9rZXInLFxuICAgIHRhcmdldElucHV0TmFtZTogJ2N1c3RvbSBVVE1fQlJPS0VSJyxcbiAgfSxcbiAgLy8gQWRkIG1vcmUgVVRNcyBvciBvdGhlciBwYXJhbWV0ZXJzIGhlcmUgZm9sbG93aW5nIHRoZSBwYXR0ZXJuXG5dO1xuIiwiLy8gc3JjL2VuZ2luZS5qc1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBkZWZhdWx0SGFuZGxlckNvbmZpZ3MgfSBmcm9tICcuL2NvbmZpZy5qcyc7XG5cbi8qKlxuICogV2FpdHMgZm9yIGEgc3BlY2lmaWMgY29va2llIGFuZCB1cGRhdGVzIHRoZSBpbnB1dCBmaWVsZCBpZiBmb3VuZC5cbiAqIFRoaXMgaXMgY2FsbGVkIE9OTFkgd2hlbiB0aGUgaW5pdGlhbCBjaGVjayBmYWlscyBhbmQgcmV0cnkgaXMgZW5hYmxlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29va2llTmFtZSBOYW1lIG9mIHRoZSBjb29raWUgdG8gd2FpdCBmb3IuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpbnB1dEVsZW1lbnQgVGhlIGFjdHVhbCBET00gZWxlbWVudCBvZiB0aGUgdGFyZ2V0IGlucHV0LlxuICogQHBhcmFtIHtvYmplY3R9IHJldHJ5Q29uZmlnIFRoZSByZXRyeU1lY2hhbmlzbSBwYXJ0IG9mIHRoZSBoYW5kbGVyIGNvbmZpZy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpbml0aWFsQXR0ZW1wdENvdW50IFRoZSBzdGFydGluZyBhdHRlbXB0IG51bWJlciAodXN1YWxseSAxKS5cbiAqL1xuZnVuY3Rpb24gd2FpdEZvckNvb2tpZUFuZFVwZGF0ZUlucHV0KFxuICBjb29raWVOYW1lLFxuICBpbnB1dEVsZW1lbnQsXG4gIHJldHJ5Q29uZmlnLFxuICBpbml0aWFsQXR0ZW1wdENvdW50ID0gMVxuKSB7XG4gIGxldCBhdHRlbXB0cyA9IGluaXRpYWxBdHRlbXB0Q291bnQ7XG4gIGNvbnN0IG1heEF0dGVtcHRzID0gcmV0cnlDb25maWcubWF4QXR0ZW1wdHMgfHwgNTtcbiAgY29uc3QgaW50ZXJ2YWwgPSByZXRyeUNvbmZpZy5pbnRlcnZhbCB8fCA1MDAwO1xuXG4gIGZ1bmN0aW9uIGNoZWNrQ29va2llV2l0aFJldHJ5KCkge1xuICAgIHV0aWxzLnN0YXJ0R3JvdXAoXG4gICAgICBgUmV0cnlpbmcgZm9yICR7Y29va2llTmFtZX0gQ29va2llIChBdHRlbXB0ICR7YXR0ZW1wdHN9LyR7bWF4QXR0ZW1wdHN9KWAsXG4gICAgICB0cnVlXG4gICAgKTtcblxuICAgIGNvbnN0IGNvb2tpZVZhbHVlID0gdXRpbHMuZ2V0Q29va2llKGNvb2tpZU5hbWUpOyAvLyBHZXQgZnJlc2ggY29va2llc1xuXG4gICAgaWYgKGNvb2tpZVZhbHVlKSB7XG4gICAgICAvLyAtLS0gQ29va2llIEZvdW5kIG9uIFJldHJ5IC0tLVxuICAgICAgaW5wdXRFbGVtZW50LnZhbHVlID0gY29va2llVmFsdWU7XG4gICAgICB1dGlscy5sb2dEZWJ1ZyhcbiAgICAgICAgYElucHV0IGZpZWxkICcke2lucHV0RWxlbWVudC5uYW1lfScgdXBkYXRlZCBmcm9tIFJFVFJJRUQgY29va2llICcke2Nvb2tpZU5hbWV9JzpgLFxuICAgICAgICBjb29raWVWYWx1ZVxuICAgICAgKTtcbiAgICAgIHV0aWxzLmVuZEdyb3VwKCk7XG4gICAgICByZXR1cm47IC8vIFN1Y2Nlc3M6IFN0b3AgcmV0cnlpbmcuXG4gICAgfVxuXG4gICAgLy8gLS0tIENvb2tpZSBOb3QgRm91bmQgLS0tXG4gICAgYXR0ZW1wdHMrKztcbiAgICBpZiAoYXR0ZW1wdHMgPiBtYXhBdHRlbXB0cykge1xuICAgICAgLy8gLS0tIE1heCBBdHRlbXB0cyBSZWFjaGVkIC0tLVxuICAgICAgdXRpbHMubG9nRXJyb3IoXG4gICAgICAgIGBGYWlsZWQgdG8gZmluZCAke2Nvb2tpZU5hbWV9IGNvb2tpZSBhZnRlciAke21heEF0dGVtcHRzfSB0b3RhbCBhdHRlbXB0cy4gSW5wdXQgZmllbGQgJyR7aW5wdXRFbGVtZW50Lm5hbWV9JyBtaWdodCByZW1haW4gZW1wdHkgb3IgdW5jaGFuZ2VkLmBcbiAgICAgICk7XG4gICAgICB1dGlscy5lbmRHcm91cCgpO1xuICAgICAgcmV0dXJuOyAvLyBGYWlsdXJlOiBTdG9wIHJldHJ5aW5nLlxuICAgIH1cblxuICAgIC8vIC0tLSBTY2hlZHVsZSBOZXh0IEF0dGVtcHQgLS0tXG4gICAgdXRpbHMubG9nRGVidWcoXG4gICAgICBgQ29va2llICR7Y29va2llTmFtZX0gc3RpbGwgbm90IGZvdW5kLiBXaWxsIHJldHJ5IGFnYWluIGluICR7XG4gICAgICAgIGludGVydmFsIC8gMTAwMFxuICAgICAgfSBzZWNvbmRzLmBcbiAgICApO1xuICAgIHNldFRpbWVvdXQoY2hlY2tDb29raWVXaXRoUmV0cnksIGludGVydmFsKTtcbiAgICB1dGlscy5lbmRHcm91cCgpO1xuICB9XG5cbiAgLy8gU3RhcnQgdGhlIGZpcnN0IHJldHJ5IGNoZWNrICh2aWEgc2V0VGltZW91dClcbiAgdXRpbHMubG9nRGVidWcoXG4gICAgYENvb2tpZSAke2Nvb2tpZU5hbWV9IG5vdCBmb3VuZCBpbml0aWFsbHkuIFN0YXJ0aW5nIHJldHJ5IGNoZWNrcyAoQXR0ZW1wdCAke2F0dGVtcHRzfSkuYFxuICApO1xuICBzZXRUaW1lb3V0KGNoZWNrQ29va2llV2l0aFJldHJ5LCBpbnRlcnZhbCk7XG59XG5cbi8qKlxuICogUHJvY2Vzc2VzIGEgc2luZ2xlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZyb20gdGhlIGhhbmRsZXJDb25maWdzIGFycmF5LlxuICogRmluZHMgdmFsdWVzIGZyb20gVVJML2Nvb2tpZSwgZm9ybWF0cywgdXBkYXRlcyBpbnB1dCwgc2V0cyBjb29raWVzLCBhbmQgaW5pdGlhdGVzIHJldHJ5IGlmIG5lZWRlZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgQSBzaW5nbGUgY29uZmlndXJhdGlvbiBvYmplY3QgZnJvbSBgaGFuZGxlckNvbmZpZ3NgLlxuICovXG5mdW5jdGlvbiBwcm9jZXNzSGFuZGxlcihjb25maWcsIGlucHV0RWxlbWVudCkge1xuICB1dGlscy5zdGFydEdyb3VwKGBQcm9jZXNzaW5nIEhhbmRsZXI6ICR7Y29uZmlnLmlkfWAsIHRydWUpO1xuXG4gIGlmICghaW5wdXRFbGVtZW50KSB7XG4gICAgdXRpbHMubG9nRXJyb3IoXG4gICAgICBgVGFyZ2V0IGlucHV0IGZpZWxkICcke2NvbmZpZy50YXJnZXRJbnB1dE5hbWV9JyBmb3IgaGFuZGxlciAnJHtjb25maWcuaWR9JyBub3QgZm91bmQuIFNraXBwaW5nLmBcbiAgICApO1xuICAgIHV0aWxzLmVuZEdyb3VwKCk7XG4gICAgcmV0dXJuOyAvLyBDYW5ub3QgcHJvY2VlZCB3aXRob3V0IHRoZSB0YXJnZXQgaW5wdXRcbiAgfVxuXG4gIGxldCByYXdWYWx1ZSA9IG51bGw7XG4gIGxldCB2YWx1ZVNvdXJjZSA9IG51bGw7IC8vICd1cmwnIG9yICdjb29raWUnXG5cbiAgLy8gMS4gQ2hlY2sgVVJMIFNvdXJjZVxuICBpZiAoY29uZmlnLnNvdXJjZVR5cGUuaW5jbHVkZXMoJ3VybCcpICYmIGNvbmZpZy51cmxQYXJhbU5hbWUpIHtcbiAgICByYXdWYWx1ZSA9IHV0aWxzLlVSTF9QQVJBTVMuZ2V0KGNvbmZpZy51cmxQYXJhbU5hbWUpO1xuICAgIGlmIChyYXdWYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdmFsdWVTb3VyY2UgPSAndXJsJztcbiAgICAgIHV0aWxzLmxvZ0RlYnVnKFxuICAgICAgICBgRm91bmQgcmF3IHZhbHVlIGZvciAnJHtjb25maWcuaWR9JyBpbiBVUkwgKCcke2NvbmZpZy51cmxQYXJhbU5hbWV9Jyk6YCxcbiAgICAgICAgcmF3VmFsdWVcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gMi4gQ2hlY2sgQ29va2llIFNvdXJjZSAoaWYgbm90IGZvdW5kIGluIFVSTCBvciBpZiBzb3VyY2UgaXMgb25seSBjb29raWUpXG4gIGlmIChcbiAgICByYXdWYWx1ZSA9PT0gbnVsbCAmJlxuICAgIGNvbmZpZy5zb3VyY2VUeXBlLmluY2x1ZGVzKCdjb29raWUnKSAmJlxuICAgIGNvbmZpZy5jb29raWVOYW1lXG4gICkge1xuICAgIHJhd1ZhbHVlID0gdXRpbHMuZ2V0Q29va2llKGNvbmZpZy5jb29raWVOYW1lKTsgLy8gR2V0cyBmcmVzaCBjb29raWVzXG4gICAgaWYgKHJhd1ZhbHVlICE9PSBudWxsKSB7XG4gICAgICB2YWx1ZVNvdXJjZSA9ICdjb29raWUnO1xuICAgICAgdXRpbHMubG9nRGVidWcoXG4gICAgICAgIGBGb3VuZCByYXcgdmFsdWUgZm9yICcke2NvbmZpZy5pZH0nIGluIENvb2tpZSAoJyR7Y29uZmlnLmNvb2tpZU5hbWV9Jyk6YCxcbiAgICAgICAgcmF3VmFsdWVcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gMy4gUHJvY2VzcyBGb3VuZCBWYWx1ZSAob3IgaGFuZGxlIG5vdCBmb3VuZClcbiAgaWYgKHJhd1ZhbHVlICE9PSBudWxsKSB7XG4gICAgbGV0IGZpbmFsVmFsdWUgPSByYXdWYWx1ZTtcblxuICAgIC8vIDNhLiBBcHBseSBGb3JtYXR0aW5nIChpZiBjb25maWd1cmVkIGFuZCB2YWx1ZSBleGlzdHMpXG4gICAgaWYgKHR5cGVvZiBjb25maWcuYXBwbHlGb3JtYXR0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZWQgPSBjb25maWcuYXBwbHlGb3JtYXR0aW5nKHJhd1ZhbHVlKTtcbiAgICAgICAgaWYgKGZvcm1hdHRlZCAhPT0gbnVsbCAmJiBmb3JtYXR0ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZpbmFsVmFsdWUgPSBmb3JtYXR0ZWQ7XG4gICAgICAgICAgdXRpbHMubG9nRGVidWcoYEZvcm1hdHRlZCB2YWx1ZSBmb3IgJyR7Y29uZmlnLmlkfSc6YCwgZmluYWxWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXRpbHMubG9nRGVidWcoXG4gICAgICAgICAgICBgRm9ybWF0dGluZyBmdW5jdGlvbiBmb3IgJyR7Y29uZmlnLmlkfScgcmV0dXJuZWQgbnVsbC91bmRlZmluZWQuIFVzaW5nIHJhdyB2YWx1ZS5gXG4gICAgICAgICAgKTtcbiAgICAgICAgICBmaW5hbFZhbHVlID0gcmF3VmFsdWU7IC8vIEZhbGxiYWNrIHRvIHJhdyBpZiBmb3JtYXR0ZXIgcmV0dXJucyBub3RoaW5nIHVzZWZ1bFxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChmb3JtYXRFcnJvcikge1xuICAgICAgICB1dGlscy5sb2dFcnJvcihcbiAgICAgICAgICBgRXJyb3IgYXBwbHlpbmcgZm9ybWF0dGluZyBmdW5jdGlvbiBmb3IgaGFuZGxlciAnJHtjb25maWcuaWR9JzogJHtmb3JtYXRFcnJvci5tZXNzYWdlfS4gVXNpbmcgcmF3IHZhbHVlLmBcbiAgICAgICAgKTtcbiAgICAgICAgZmluYWxWYWx1ZSA9IHJhd1ZhbHVlOyAvLyBVc2UgcmF3IHZhbHVlIG9uIGVycm9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gM2IuIFVwZGF0ZSBJbnB1dCBGaWVsZFxuICAgIGlucHV0RWxlbWVudC52YWx1ZSA9IGZpbmFsVmFsdWU7XG4gICAgdXRpbHMubG9nRGVidWcoXG4gICAgICBgSW5wdXQgZmllbGQgJyR7Y29uZmlnLnRhcmdldElucHV0TmFtZX0nIHVwZGF0ZWQgZm9yICcke2NvbmZpZy5pZH0nLiBWYWx1ZSBTb3VyY2U6ICR7dmFsdWVTb3VyY2V9LmBcbiAgICApO1xuXG4gICAgLy8gM2MuIFNldCBDb29raWUgKGlmIGNvbmZpZ3VyZWQgZm9yIFVSTCBoaXQgYW5kIHZhbHVlIGNhbWUgZnJvbSBVUkwpXG4gICAgaWYgKFxuICAgICAgdmFsdWVTb3VyY2UgPT09ICd1cmwnICYmXG4gICAgICBjb25maWcuc2V0Q29va2llICYmXG4gICAgICBjb25maWcuc2V0Q29va2llLmVuYWJsZWRPblVybEhpdFxuICAgICkge1xuICAgICAgdXRpbHMuc2V0Q29va2llKFxuICAgICAgICBjb25maWcuc2V0Q29va2llLmNvb2tpZU5hbWVUb1NldCxcbiAgICAgICAgZmluYWxWYWx1ZSwgLy8gVXNlIHRoZSBwb3RlbnRpYWxseSBmb3JtYXR0ZWQgdmFsdWUgZm9yIHRoZSBjb29raWVcbiAgICAgICAgY29uZmlnLnNldENvb2tpZS5kYXlzVG9FeHBpcnlcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIDQuIFZhbHVlIE5vdCBGb3VuZCAtIEluaXRpYXRlIFJldHJ5IG9yIENsZWFyIElucHV0XG4gICAgdXRpbHMubG9nRGVidWcoXG4gICAgICBgTm8gaW5pdGlhbCB2YWx1ZSBmb3VuZCBmb3IgJyR7Y29uZmlnLmlkfScgZnJvbSBjb25maWd1cmVkIHNvdXJjZXMgKCR7Y29uZmlnLnNvdXJjZVR5cGV9KS5gXG4gICAgKTtcblxuICAgIGlmIChcbiAgICAgIGNvbmZpZy5zb3VyY2VUeXBlLmluY2x1ZGVzKCdjb29raWUnKSAmJlxuICAgICAgY29uZmlnLnJldHJ5TWVjaGFuaXNtICYmXG4gICAgICBjb25maWcucmV0cnlNZWNoYW5pc20uZW5hYmxlZFxuICAgICkge1xuICAgICAgLy8gSW5pdGlhdGUgcmV0cnkgb25seSBpZiBjb29raWUgd2FzIGEgcG90ZW50aWFsIHNvdXJjZSBhbmQgcmV0cnkgaXMgZW5hYmxlZFxuICAgICAgd2FpdEZvckNvb2tpZUFuZFVwZGF0ZUlucHV0KFxuICAgICAgICBjb25maWcuY29va2llTmFtZSxcbiAgICAgICAgaW5wdXRFbGVtZW50LFxuICAgICAgICBjb25maWcucmV0cnlNZWNoYW5pc20sXG4gICAgICAgIDEgLy8gU3RhcnQgY291bnRpbmcgYXR0ZW1wdHMgZnJvbSAxIGZvciByZXRyeVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm8gcmV0cnkgY29uZmlndXJlZCBvciBhcHBsaWNhYmxlLCBlbnN1cmUgaW5wdXQgaXMgZW1wdHlcbiAgICAgIGlmIChpbnB1dEVsZW1lbnQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIC8vIE9ubHkgbG9nIGlmIHdlIGFyZSBjaGFuZ2luZyBpdFxuICAgICAgICBpbnB1dEVsZW1lbnQudmFsdWUgPSAnJztcbiAgICAgICAgdXRpbHMubG9nRGVidWcoXG4gICAgICAgICAgYEVuc3VyZWQgaW5wdXQgZmllbGQgJyR7Y29uZmlnLnRhcmdldElucHV0TmFtZX0nIGZvciAnJHtjb25maWcuaWR9JyBpcyBlbXB0eSAodmFsdWUgbm90IGZvdW5kIGFuZCBubyByZXRyeSkuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmVuZEdyb3VwKCk7IC8vIEVuZCBwcm9jZXNzaW5nIGdyb3VwIGZvciB0aGlzIGhhbmRsZXJcbn1cblxuLy8gRGVmaW5lIHRoZSBtYWluIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uXG5leHBvcnQgZnVuY3Rpb24gaW5pdChjdXN0b21Db25maWdzKSB7XG4gIHV0aWxzLnN0YXJ0R3JvdXAoJ0luaXRpYWxpemluZyBVbmlmaWVkIFBhcmFtZXRlciBIYW5kbGVyJyk7XG4gIGNvbnN0IGNvbmZpZ3NUb1VzZSA9XG4gICAgQXJyYXkuaXNBcnJheShjdXN0b21Db25maWdzKSAmJiBjdXN0b21Db25maWdzLmxlbmd0aCA+IDBcbiAgICAgID8gY3VzdG9tQ29uZmlnc1xuICAgICAgOiBkZWZhdWx0SGFuZGxlckNvbmZpZ3M7IC8vIFVzZSBjdXN0b20gY29uZmlnIGlmIHZhbGlkLCBlbHNlIGRlZmF1bHRcblxuICB1dGlscy5sb2dEZWJ1ZygnVXNpbmcgY29uZmlndXJhdGlvbnM6JywgY29uZmlnc1RvVXNlKTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoY29uZmlnc1RvVXNlKSB8fCBjb25maWdzVG9Vc2UubGVuZ3RoID09PSAwKSB7XG4gICAgdXRpbHMubG9nRXJyb3IoJ0hhbmRsZXIgY29uZmlndXJhdGlvbnMgYXJlIG1pc3Npbmcgb3IgZW1wdHkuJyk7XG4gICAgdXRpbHMuZW5kR3JvdXAoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25maWdzVG9Vc2UuZm9yRWFjaCgoY29uZmlnKSA9PiB7XG4gICAgLy8gQmFzaWMgdmFsaWRhdGlvblxuICAgIGlmIChcbiAgICAgICFjb25maWcgfHxcbiAgICAgIHR5cGVvZiBjb25maWcgIT09ICdvYmplY3QnIHx8XG4gICAgICAhY29uZmlnLmlkIHx8XG4gICAgICAhY29uZmlnLnNvdXJjZVR5cGUgfHxcbiAgICAgICFjb25maWcudGFyZ2V0SW5wdXROYW1lXG4gICAgKSB7XG4gICAgICB1dGlscy5sb2dFcnJvcihgSW52YWxpZCBoYW5kbGVyIGNvbmZpZzogJHtKU09OLnN0cmluZ2lmeShjb25maWcpfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgaW5wdXRbbmFtZT1cIiR7Y29uZmlnLnRhcmdldElucHV0TmFtZX1cIl1gXG4gICAgKTtcbiAgICBpZiAoIWlucHV0RWxlbWVudCkge1xuICAgICAgdXRpbHMubG9nRXJyb3IoXG4gICAgICAgIGBUYXJnZXQgaW5wdXQgJyR7Y29uZmlnLnRhcmdldElucHV0TmFtZX0nIGZvciAnJHtjb25maWcuaWR9JyBub3QgZm91bmQuIFNraXBwaW5nLmBcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHByb2Nlc3NIYW5kbGVyKGNvbmZpZywgaW5wdXRFbGVtZW50KTsgLy8gUGFzcyBlbGVtZW50XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHV0aWxzLmxvZ0Vycm9yKFxuICAgICAgICBgVW5leHBlY3RlZCBlcnJvciBwcm9jZXNzaW5nIGhhbmRsZXIgJyR7Y29uZmlnLmlkfSc6ICR7ZXJyb3IubWVzc2FnZX1gXG4gICAgICApO1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7IC8vIExvZyBmdWxsIHN0YWNrIHRyYWNlIGZvciB1bmV4cGVjdGVkIGVycm9yc1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMubG9nRGVidWcoJ0ZpbmlzaGVkIHByb2Nlc3NpbmcgY29uZmlndXJhdGlvbnMuJyk7XG4gIHV0aWxzLmVuZEdyb3VwKCk7XG59XG4iLCIvLyBzcmMvdXRpbHMuanNcbmV4cG9ydCBjb25zdCBERUJVR19NT0RFID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5pbmNsdWRlcygnZGVidWc9dHJ1ZScpO1xuZXhwb3J0IGNvbnN0IFVSTF9QQVJBTVMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IobWVzc2FnZSkge1xuICBjb25zb2xlLmVycm9yKGBbVW5pZmllZCBQYXJhbSBIYW5kbGVyIEVycm9yXTogJHttZXNzYWdlfWApO1xuICAvLyBSZW1vdmVkIGFsZXJ0IGZhbGxiYWNrIC0gZ2VuZXJhbGx5IG5vdCBkZXNpcmVkIGZvciBwcm9kdWN0aW9uIHNjcmlwdHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0RlYnVnKG1lc3NhZ2UsIC4uLmFyZ3MpIHtcbiAgaWYgKERFQlVHX01PREUgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUubG9nKSB7XG4gICAgY29uc29sZS5sb2coYFtVbmlmaWVkIFBhcmFtIEhhbmRsZXJdICR7bWVzc2FnZX1gLCAuLi5hcmdzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRHcm91cChuYW1lLCBjb2xsYXBzZWQgPSBmYWxzZSkge1xuICBpZiAoREVCVUdfTU9ERSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zdCBncm91cE1ldGhvZCA9IGNvbGxhcHNlZCA/IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgOiBjb25zb2xlLmdyb3VwO1xuICAgIGlmIChncm91cE1ldGhvZCkge1xuICAgICAgZ3JvdXBNZXRob2QoYFtVbmlmaWVkIFBhcmFtIEhhbmRsZXJdICR7bmFtZX1gKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuZEdyb3VwKCkge1xuICBpZiAoREVCVUdfTU9ERSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS5ncm91cEVuZCkge1xuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb29raWVzKCkge1xuICBzdGFydEdyb3VwKCdQYXJzaW5nIENvb2tpZXMnLCB0cnVlKTtcbiAgY29uc3QgY29va2llcyA9IHt9O1xuICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKS5mb3JFYWNoKGZ1bmN0aW9uIChjb29raWUpIHtcbiAgICAgIGNvbnN0IGVxUG9zID0gY29va2llLmluZGV4T2YoJz0nKTtcbiAgICAgIGlmIChlcVBvcyA+IDApIHtcbiAgICAgICAgLy8gRW5zdXJlICc9JyBpcyBmb3VuZCBhbmQgbm90IHRoZSBmaXJzdCBjaGFyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjb29raWUuc3Vic3RyaW5nKDAsIGVxUG9zKS50cmltKCk7XG4gICAgICAgIGxldCB2YWx1ZSA9IGNvb2tpZS5zdWJzdHJpbmcoZXFQb3MgKyAxKS50cmltKCk7XG4gICAgICAgIC8vIERlY29kZSBjb29raWUgdmFsdWUsIGhhbmRsZSBwb3RlbnRpYWwgcXVvdGVzXG4gICAgICAgIGlmICh2YWx1ZS5zdGFydHNXaXRoKCdcIicpICYmIHZhbHVlLmVuZHNXaXRoKCdcIicpKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxLCAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb29raWVzW25hbWVdID0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvb2tpZXNbbmFtZV0gPSB2YWx1ZTsgLy8gRmFsbGJhY2sgdG8gcmF3IHZhbHVlIGlmIGRlY29kaW5nIGZhaWxzXG4gICAgICAgICAgbG9nRXJyb3IoYEZhaWxlZCB0byBkZWNvZGUgY29va2llIFwiJHtuYW1lfVwiOiAke2UubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGxvZ0RlYnVnKCdQYXJzZWQgY29va2llczonLCBjb29raWVzKTtcbiAgZW5kR3JvdXAoKTtcbiAgcmV0dXJuIGNvb2tpZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAvLyBBbHdheXMgcGFyc2UgZnJlc2ggY29va2llc1xuICBjb25zdCBjdXJyZW50Q29va2llcyA9IHBhcnNlQ29va2llcygpO1xuICBsb2dEZWJ1ZyhgR2V0dGluZyBjb29raWUgJyR7bmFtZX0nOmAsIGN1cnJlbnRDb29raWVzW25hbWVdKTtcbiAgcmV0dXJuIGN1cnJlbnRDb29raWVzW25hbWVdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcbiAgbGV0IGV4cGlyZXMgPSAnJztcbiAgaWYgKGRheXMpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyBkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgfVxuICAvLyBFbmNvZGUgdGhlIHZhbHVlIGZvciBzYWZldHlcbiAgY29uc3QgZW5jb2RlZFZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgZG9jdW1lbnQuY29va2llID1cbiAgICBuYW1lICsgJz0nICsgZW5jb2RlZFZhbHVlICsgZXhwaXJlcyArICc7IHBhdGg9LzsgU2FtZVNpdGU9TGF4JzsgLy8gQWRkZWQgU2FtZVNpdGU9TGF4IGZvciBnb29kIHByYWN0aWNlXG4gIGxvZ0RlYnVnKGBDb29raWUgc2V0OiAke25hbWV9ID0gJHt2YWx1ZX0gKEV4cGlyZXMgaW4gJHtkYXlzfSBkYXlzKWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ViZG9tYWluSW5kZXgoKSB7XG4gIGNvbnN0IGhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAvLyBCYXNpYyBjaGVjayBmb3IgbG9jYWxob3N0IG9yIElQIC0gbWlnaHQgbmVlZCByZWZpbmVtZW50IGZvciBlZGdlIGNhc2VzXG4gIGlmIChob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgfHwgL15cXGR7MSwzfShcXC5cXGR7MSwzfSl7M30kLy50ZXN0KGhvc3RuYW1lKSkge1xuICAgIHJldHVybiAxOyAvLyBEZWZhdWx0IGZvciBsb2NhbC9JUFxuICB9XG4gIGlmIChob3N0bmFtZSA9PT0gJ2NvbScpIHJldHVybiAwOyAvLyBPcmlnaW5hbCBjaGVja1xuICBjb25zdCBwYXJ0cyA9IGhvc3RuYW1lLnNwbGl0KCcuJyk7XG4gIC8vIEhhbmRsZSBjYXNlcyBsaWtlIGV4YW1wbGUuY29tIChsZW5ndGggMiAtPiBpbmRleCAxKVxuICAvLyBhbmQgd3d3LmV4YW1wbGUuY29tIChsZW5ndGggMyAtPiBpbmRleCAyKVxuICAvLyBDb25zaWRlciBUTERzIGxpa2UgLmNvLnVrIC0gdGhpcyBzaW1wbGUgbG9naWMgbWlnaHQgbmVlZCBhZGp1c3RtZW50IGlmIHNwZWNpZmljIEZCIHJlcXVpcmVtZW50cyBkaWZmZXIuXG4gIHJldHVybiBNYXRoLm1heCgxLCBwYXJ0cy5sZW5ndGggLSAxKTsgLy8gRW5zdXJlIGF0IGxlYXN0IDFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEZiQ2xpY2tJZChmYmNsaWQpIHtcbiAgaWYgKCFmYmNsaWQpIHJldHVybiBudWxsO1xuICBjb25zdCBzdWJkb21haW5JbmRleCA9IGdldFN1YmRvbWFpbkluZGV4KCk7XG4gIGNvbnN0IGNyZWF0aW9uVGltZSA9IERhdGUubm93KCk7XG4gIHJldHVybiBgZmIuJHtzdWJkb21haW5JbmRleH0uJHtjcmVhdGlvblRpbWV9LiR7ZmJjbGlkfWA7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHNyYy9tYWluLmpzXG5pbXBvcnQgeyBpbml0IH0gZnJvbSAnLi9lbmdpbmUuanMnO1xuXG4vLyBPcHRpb24gMTogSW1tZWRpYXRlbHkgaW5pdGlhbGl6ZSB3aXRoIGRlZmF1bHQgY29uZmlnXG4vLyBmdW5jdGlvbiBydW4oKSB7IGluaXQoKTsgfVxuXG4vLyBPcHRpb24gMjogRXhwb3NlIGluaXQgZ2xvYmFsbHkgdG8gYWxsb3cgY3VzdG9tIGNvbmZpZyBpbmplY3Rpb24gKFJlY29tbWVuZGVkIGZvciBmbGV4aWJpbGl0eSlcbmZ1bmN0aW9uIHJ1bigpIHtcbiAgLy8gRXhwb3NlIHRoZSBpbml0IGZ1bmN0aW9uIGdsb2JhbGx5LCBwZXJoYXBzIG5hbWVzcGFjZWRcbiAgd2luZG93LlVuaWZpZWRQYXJhbUhhbmRsZXIgPSB7XG4gICAgaW5pdDogaW5pdCwgLy8gQWxsb3dzIGNhbGxpbmcgVW5pZmllZFBhcmFtSGFuZGxlci5pbml0KG15Q3VzdG9tQ29uZmlncykgZnJvbSBIVE1MXG4gIH07XG4gIC8vIE9wdGlvbmFsbHksIGF1dG8taW5pdGlhbGl6ZSBpZiBubyBnbG9iYWwgY29uZmlnIGlzIGRldGVjdGVkIGFmdGVyIGEgc2hvcnQgZGVsYXksXG4gIC8vIG9yIGp1c3QgcmVxdWlyZSBtYW51YWwgaW5pdGlhbGl6YXRpb24gZnJvbSB0aGUgSFRNTC5cbiAgLy8gRm9yIHNpbXBsaWNpdHksIHdlJ2xsIHJlcXVpcmUgbWFudWFsIGluaXQgY2FsbCBmcm9tIEhUTUwgd2hlbiB1c2luZyBjdXN0b20gY29uZmlnLlxuICAvLyBJZiB5b3UgYWx3YXlzIHdhbnQgaXQgdG8gcnVuIHdpdGggZGVmYXVsdHMgdW5sZXNzIG92ZXJyaWRkZW4sIHlvdSBjb3VsZCBkbzpcbiAgaWYgKCF3aW5kb3cucGFyYW1IYW5kbGVySW5pdGlhbGl6ZWQpIHtcbiAgICAvLyBBdm9pZCBkb3VibGUgaW5pdFxuICAgIC8vIENoZWNrIGlmIGEgZ2xvYmFsIGNvbmZpZyBleGlzdHMsIG90aGVyd2lzZSB1c2UgZGVmYXVsdCBieSBjYWxsaW5nIGluaXQoKVxuICAgIGlmICh0eXBlb2Ygd2luZG93LmhhbmRsZXJDdXN0b21Db25maWdzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaW5pdCh3aW5kb3cuaGFuZGxlckN1c3RvbUNvbmZpZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbml0KCk7IC8vIEluaXRpYWxpemUgd2l0aCBkZWZhdWx0cyBmcm9tIGNvbmZpZy5qc1xuICAgIH1cbiAgICB3aW5kb3cucGFyYW1IYW5kbGVySW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG59XG5cbi8vIERPTSBSZWFkeSBjaGVja1xuaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgcnVuKTtcbn0gZWxzZSB7XG4gIHJ1bigpO1xufVxuIl0sIm5hbWVzIjpbImZvcm1hdEZiQ2xpY2tJZCIsImhhbmRsZXJDb25maWdzIiwiaWQiLCJzb3VyY2VUeXBlIiwidXJsUGFyYW1OYW1lIiwiY29va2llTmFtZSIsInRhcmdldElucHV0TmFtZSIsImFwcGx5Rm9ybWF0dGluZyIsInNldENvb2tpZSIsImVuYWJsZWRPblVybEhpdCIsImNvb2tpZU5hbWVUb1NldCIsImRheXNUb0V4cGlyeSIsInJldHJ5TWVjaGFuaXNtIiwiZW5hYmxlZCIsIm1heEF0dGVtcHRzIiwiaW50ZXJ2YWwiLCJ1dGlscyIsImRlZmF1bHRIYW5kbGVyQ29uZmlncyIsIndhaXRGb3JDb29raWVBbmRVcGRhdGVJbnB1dCIsImlucHV0RWxlbWVudCIsInJldHJ5Q29uZmlnIiwiaW5pdGlhbEF0dGVtcHRDb3VudCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImF0dGVtcHRzIiwiY2hlY2tDb29raWVXaXRoUmV0cnkiLCJzdGFydEdyb3VwIiwiY29uY2F0IiwiY29va2llVmFsdWUiLCJnZXRDb29raWUiLCJ2YWx1ZSIsImxvZ0RlYnVnIiwibmFtZSIsImVuZEdyb3VwIiwibG9nRXJyb3IiLCJzZXRUaW1lb3V0IiwicHJvY2Vzc0hhbmRsZXIiLCJjb25maWciLCJyYXdWYWx1ZSIsInZhbHVlU291cmNlIiwiaW5jbHVkZXMiLCJVUkxfUEFSQU1TIiwiZ2V0IiwiZmluYWxWYWx1ZSIsImZvcm1hdHRlZCIsImZvcm1hdEVycm9yIiwibWVzc2FnZSIsImluaXQiLCJjdXN0b21Db25maWdzIiwiY29uZmlnc1RvVXNlIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsIl90eXBlb2YiLCJKU09OIiwic3RyaW5naWZ5IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZXJyb3IiLCJjb25zb2xlIiwiREVCVUdfTU9ERSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwibG9nIiwiX2NvbnNvbGUiLCJfbGVuIiwiYXJncyIsIl9rZXkiLCJhcHBseSIsImNvbGxhcHNlZCIsImdyb3VwTWV0aG9kIiwiZ3JvdXBDb2xsYXBzZWQiLCJncm91cCIsImdyb3VwRW5kIiwicGFyc2VDb29raWVzIiwiY29va2llcyIsImNvb2tpZSIsInNwbGl0IiwiZXFQb3MiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwidHJpbSIsInN0YXJ0c1dpdGgiLCJlbmRzV2l0aCIsInNsaWNlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZSIsImN1cnJlbnRDb29raWVzIiwiZGF5cyIsImV4cGlyZXMiLCJkYXRlIiwiRGF0ZSIsInNldFRpbWUiLCJnZXRUaW1lIiwidG9VVENTdHJpbmciLCJlbmNvZGVkVmFsdWUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJnZXRTdWJkb21haW5JbmRleCIsImhvc3RuYW1lIiwidGVzdCIsInBhcnRzIiwiTWF0aCIsIm1heCIsImZiY2xpZCIsInN1YmRvbWFpbkluZGV4IiwiY3JlYXRpb25UaW1lIiwibm93IiwicnVuIiwiVW5pZmllZFBhcmFtSGFuZGxlciIsInBhcmFtSGFuZGxlckluaXRpYWxpemVkIiwiaGFuZGxlckN1c3RvbUNvbmZpZ3MiLCJyZWFkeVN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJzb3VyY2VSb290IjoiIn0=