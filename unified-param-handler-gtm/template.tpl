___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Unified Parameter Handler",
  "brand": {
    "id": "brand_dummy",
    "displayName": "Atomic Agility",
    "thumbnail": ""
  },
  "description": "Captures tracking parameters (fbclid, gclid, UTMs, etc.) from URLs and cookies, then injects them into hidden form fields for CRM submission.",
  "containerContexts": [
    "WEB"
  ],
  "categories": [
    "MARKETING",
    "CONVERSIONS"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "GROUP",
    "name": "facebookGroup",
    "displayName": "Facebook Parameters",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "enableFbc",
        "checkboxText": "Enable FBC (Facebook Click ID)",
        "simpleValueType": true,
        "defaultValue": true,
        "help": "Captures fbclid from URL, formats it to _fbc cookie format, and populates form field."
      },
      {
        "type": "TEXT",
        "name": "fbcInputName",
        "displayName": "FBC Form Field Name",
        "simpleValueType": true,
        "defaultValue": "fbc",
        "enablingConditions": [
          {
            "paramName": "enableFbc",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "enableFbp",
        "checkboxText": "Enable FBP (Facebook Browser ID)",
        "simpleValueType": true,
        "defaultValue": true,
        "help": "Reads _fbp cookie set by Meta Pixel and populates form field."
      },
      {
        "type": "TEXT",
        "name": "fbpInputName",
        "displayName": "FBP Form Field Name",
        "simpleValueType": true,
        "defaultValue": "fbp",
        "enablingConditions": [
          {
            "paramName": "enableFbp",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "googleGroup",
    "displayName": "Google Parameters",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "enableGclid",
        "checkboxText": "Enable GCLID (Google Click ID)",
        "simpleValueType": true,
        "defaultValue": true
      },
      {
        "type": "TEXT",
        "name": "gclidInputName",
        "displayName": "GCLID Form Field Name",
        "simpleValueType": true,
        "defaultValue": "gclid",
        "enablingConditions": [
          {
            "paramName": "enableGclid",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "enableWbraid",
        "checkboxText": "Enable WBRAID (Google Web-to-App)",
        "simpleValueType": true,
        "defaultValue": false
      },
      {
        "type": "TEXT",
        "name": "wbraidInputName",
        "displayName": "WBRAID Form Field Name",
        "simpleValueType": true,
        "defaultValue": "wbraid",
        "enablingConditions": [
          {
            "paramName": "enableWbraid",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "enableGbraid",
        "checkboxText": "Enable GBRAID (Google App-to-Web)",
        "simpleValueType": true,
        "defaultValue": false
      },
      {
        "type": "TEXT",
        "name": "gbraidInputName",
        "displayName": "GBRAID Form Field Name",
        "simpleValueType": true,
        "defaultValue": "gbraid",
        "enablingConditions": [
          {
            "paramName": "enableGbraid",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "utmGroup",
    "displayName": "UTM Parameters",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "enableUtms",
        "checkboxText": "Enable UTM Parameters",
        "simpleValueType": true,
        "defaultValue": true
      },
      {
        "type": "SIMPLE_TABLE",
        "name": "utmMappings",
        "displayName": "UTM Parameter Mappings",
        "simpleTableColumns": [
          {
            "defaultValue": "",
            "displayName": "UTM Parameter",
            "name": "utmParam",
            "type": "SELECT",
            "selectItems": [
              {
                "value": "utm_source",
                "displayValue": "utm_source"
              },
              {
                "value": "utm_medium",
                "displayValue": "utm_medium"
              },
              {
                "value": "utm_campaign",
                "displayValue": "utm_campaign"
              },
              {
                "value": "utm_term",
                "displayValue": "utm_term"
              },
              {
                "value": "utm_content",
                "displayValue": "utm_content"
              },
              {
                "value": "utm_id",
                "displayValue": "utm_id"
              }
            ]
          },
          {
            "defaultValue": "",
            "displayName": "Form Field Name",
            "name": "formField",
            "type": "TEXT"
          }
        ],
        "enablingConditions": [
          {
            "paramName": "enableUtms",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "newRowButtonText": "Add UTM Mapping"
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "browserInfoGroup",
    "displayName": "Browser Information",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "enableUserAgent",
        "checkboxText": "Enable User Agent Capture",
        "simpleValueType": true,
        "defaultValue": false
      },
      {
        "type": "TEXT",
        "name": "userAgentInputName",
        "displayName": "User Agent Form Field Name",
        "simpleValueType": true,
        "defaultValue": "userAgent",
        "enablingConditions": [
          {
            "paramName": "enableUserAgent",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "enableClientIp",
        "checkboxText": "Enable Client IP Capture",
        "simpleValueType": true,
        "defaultValue": false,
        "help": "Fetches client IP from ipify.org via JSONP. May add latency to form population."
      },
      {
        "type": "TEXT",
        "name": "clientIpInputName",
        "displayName": "Client IP Form Field Name",
        "simpleValueType": true,
        "defaultValue": "clientIp",
        "enablingConditions": [
          {
            "paramName": "enableClientIp",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          }
        ]
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "advancedGroup",
    "displayName": "Advanced Settings",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "enablePersistence",
        "checkboxText": "Enable localStorage Persistence",
        "simpleValueType": true,
        "defaultValue": true,
        "help": "Stores captured values in localStorage for cross-page persistence."
      },
      {
        "type": "TEXT",
        "name": "persistencePrefix",
        "displayName": "Persistence Key Prefix",
        "simpleValueType": true,
        "defaultValue": "uph_",
        "enablingConditions": [
          {
            "paramName": "enablePersistence",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "cookieExpiryDays",
        "displayName": "Cookie Expiry (Days)",
        "simpleValueType": true,
        "defaultValue": "90",
        "valueValidators": [
          {
            "type": "POSITIVE_NUMBER"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "enableDebug",
        "checkboxText": "Enable Debug Logging",
        "simpleValueType": true,
        "defaultValue": false
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "customHandlersGroup",
    "displayName": "Custom Parameters",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "SIMPLE_TABLE",
        "name": "customHandlers",
        "displayName": "Custom Parameter Handlers",
        "simpleTableColumns": [
          {
            "defaultValue": "",
            "displayName": "Parameter ID",
            "name": "id",
            "type": "TEXT"
          },
          {
            "defaultValue": "url",
            "displayName": "Source Type",
            "name": "sourceType",
            "type": "SELECT",
            "selectItems": [
              {
                "value": "url",
                "displayValue": "URL Parameter"
              },
              {
                "value": "cookie",
                "displayValue": "Cookie"
              },
              {
                "value": "url_or_cookie",
                "displayValue": "URL or Cookie"
              }
            ]
          },
          {
            "defaultValue": "",
            "displayName": "URL Param Name",
            "name": "urlParam",
            "type": "TEXT"
          },
          {
            "defaultValue": "",
            "displayName": "Cookie Name",
            "name": "cookieName",
            "type": "TEXT"
          },
          {
            "defaultValue": "",
            "displayName": "Form Field Name",
            "name": "formField",
            "type": "TEXT"
          }
        ],
        "newRowButtonText": "Add Custom Parameter"
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// GTM Sandboxed JavaScript APIs
const log = require('logToConsole');
const getUrl = require('getUrl');
const getCookieValues = require('getCookieValues');
const setCookie = require('setCookie');
const localStorage = require('localStorage');
const getTimestampMillis = require('getTimestampMillis');
const setInWindow = require('setInWindow');
const callInWindow = require('callInWindow');
const copyFromWindow = require('copyFromWindow');
const injectScript = require('injectScript');
const queryPermission = require('queryPermission');
const makeNumber = require('makeNumber');
const makeString = require('makeString');
const getType = require('getType');
const decodeUriComponent = require('decodeUriComponent');

// Constants
var SOURCE_TYPE = {
  URL: 'url',
  COOKIE: 'cookie',
  URL_OR_COOKIE: 'url_or_cookie'
};

var PERSISTENCE_PREFIX = data.persistencePrefix || 'uph_';
var COOKIE_EXPIRY_DAYS = makeNumber(data.cookieExpiryDays) || 90;

// Debug logging helper
function logDebug(message) {
  if (data.enableDebug) {
    log('[UPH] ' + message);
  }
}

// Parse query string manually (GTM doesn't have URLSearchParams)
function parseQueryString(queryString) {
  var params = {};
  if (!queryString || queryString === '') {
    return params;
  }

  // Remove leading '?' if present
  if (queryString.charAt(0) === '?') {
    queryString = queryString.substring(1);
  }

  var pairs = queryString.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eqIndex = pair.indexOf('=');
    if (eqIndex > 0) {
      var key = pair.substring(0, eqIndex);
      var value = pair.substring(eqIndex + 1);
      // Simple URL decode (handles %20, etc.)
      var decoded = decodeUriComponent(value.split('+').join(' '));
      params[key] = decoded !== undefined ? decoded : value;
    }
  }
  return params;
}

// Check if a string is a valid IP address (without regex)
function isIpAddress(hostname) {
  var parts = hostname.split('.');
  if (parts.length !== 4) {
    return false;
  }
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    // Check if part is empty or has non-digit characters
    if (part === '' || part.length > 3) {
      return false;
    }
    for (var j = 0; j < part.length; j++) {
      var charCode = part.charCodeAt(j);
      if (charCode < 48 || charCode > 57) { // '0' = 48, '9' = 57
        return false;
      }
    }
    var num = makeNumber(part);
    if (num < 0 || num > 255) {
      return false;
    }
  }
  return true;
}

// Get subdomain index for FBC cookie format
function getSubdomainIndex(hostname) {
  if (!hostname) {
    return 1;
  }

  // Check for localhost or IP address
  if (hostname === 'localhost') {
    return 1;
  }

  // Check for IP address
  if (isIpAddress(hostname)) {
    return 1;
  }

  if (hostname === 'com') {
    return 0;
  }

  var parts = hostname.split('.');
  // Handle cases like example.com (length 2 -> index 1)
  // and www.example.com (length 3 -> index 2)
  var index = parts.length - 1;
  return index > 0 ? index : 1;
}

// Format fbclid to _fbc cookie format: fb.{subdomainIndex}.{timestamp}.{fbclid}
function formatFbClickId(fbclid, hostname) {
  if (!fbclid) {
    return null;
  }
  var subdomainIndex = getSubdomainIndex(hostname);
  var timestamp = getTimestampMillis();
  return 'fb.' + subdomainIndex + '.' + timestamp + '.' + fbclid;
}

// Save to localStorage with namespace prefix
function saveToPersistentStorage(key, value) {
  if (!data.enablePersistence) {
    return;
  }

  var namespacedKey = PERSISTENCE_PREFIX + key;
  if (queryPermission('access_local_storage', 'readwrite', namespacedKey)) {
    localStorage.setItem(namespacedKey, value);
    logDebug('Persisted: ' + namespacedKey + ' = ' + value);
  }
}

// Retrieve from localStorage
function getFromPersistentStorage(key) {
  if (!data.enablePersistence) {
    return null;
  }

  var namespacedKey = PERSISTENCE_PREFIX + key;
  if (queryPermission('access_local_storage', 'read', namespacedKey)) {
    var value = localStorage.getItem(namespacedKey);
    if (value) {
      logDebug('Retrieved from storage: ' + namespacedKey + ' = ' + value);
    }
    return value;
  }
  return null;
}

// Get URL parameter value
function getUrlParam(paramName) {
  var queryString = getUrl('query');
  var params = parseQueryString(queryString);
  return params[paramName] || null;
}

// Get cookie value
function getCookieValue(cookieName) {
  var values = getCookieValues(cookieName);
  if (values && values.length > 0) {
    return values[0];
  }
  return null;
}

// Set cookie with standard options
function setTrackerCookie(name, value, days) {
  var options = {
    domain: 'auto',
    path: '/',
    'max-age': days * 24 * 60 * 60,
    secure: true,
    samesite: 'Lax'
  };

  setCookie(name, value, options);
  logDebug('Set cookie: ' + name + ' = ' + value);
}

// Setup the DOM helper function in window scope
// Store a value for form population
// Values are stored in window._uphValues for the DOM helper to use
function setFormField(fieldName, value) {
  if (!fieldName || value === null || value === undefined) {
    return;
  }

  // Store the value for later DOM population
  var uphValues = copyFromWindow('_uphValues') || {};
  uphValues[fieldName] = value;
  setInWindow('_uphValues', uphValues, true);
  logDebug('Stored value for field: ' + fieldName + ' = ' + value);

  // Try to call the DOM helper if it exists (user added Custom HTML tag)
  var helperExists = copyFromWindow('_uphSetField');
  if (helperExists) {
    callInWindow('_uphSetField', fieldName, value);
    logDebug('Called DOM helper for: ' + fieldName);
  }
}

// Store processed value for Variable Template access
function storeProcessedValue(key, value) {
  var storageKey = '_uphProcessedValues';
  var existing = copyFromWindow(storageKey) || {};
  existing[key] = value;
  setInWindow(storageKey, existing, true);
}

// Process FBC handler (Facebook Click ID)
function processFbc() {
  if (!data.enableFbc) {
    return;
  }

  logDebug('Processing FBC handler');

  var hostname = getUrl('host');
  var fbclid = getUrlParam('fbclid');
  var existingFbc = getCookieValue('_fbc');
  var value = null;
  var source = null;

  if (fbclid) {
    // Fresh click from URL
    logDebug('Found fbclid in URL: ' + fbclid);

    // Check if Meta already set a valid _fbc cookie
    if (existingFbc && existingFbc.indexOf('fb.') === 0) {
      logDebug('Preserving existing _fbc cookie from Meta: ' + existingFbc);
      value = existingFbc;
      source = 'meta_cookie';
    } else {
      // Format the fbclid ourselves
      value = formatFbClickId(fbclid, hostname);
      logDebug('Formatted FBC: ' + value);

      // Set the _fbc cookie
      setTrackerCookie('_fbc', value, COOKIE_EXPIRY_DAYS);
      source = 'url';
    }

    // Persist to localStorage
    saveToPersistentStorage('fbc', value);
  } else if (existingFbc) {
    // No URL param, but cookie exists
    value = existingFbc;
    source = 'cookie';
    logDebug('Using existing _fbc cookie: ' + value);
  } else {
    // Check localStorage
    value = getFromPersistentStorage('fbc');
    if (value) {
      source = 'storage';
      logDebug('Using persisted FBC: ' + value);
    }
  }

  if (value) {
    setFormField(data.fbcInputName, value);
    storeProcessedValue('fbc', value);
  }
}

// Process FBP handler (Facebook Browser ID)
function processFbp() {
  if (!data.enableFbp) {
    return;
  }

  logDebug('Processing FBP handler');

  var value = getCookieValue('_fbp');
  var source = null;

  if (value) {
    source = 'cookie';
    logDebug('Found _fbp cookie: ' + value);
  } else {
    // Check localStorage
    value = getFromPersistentStorage('fbp');
    if (value) {
      source = 'storage';
      logDebug('Using persisted FBP: ' + value);
    }
  }

  if (value) {
    // Persist for future page loads
    saveToPersistentStorage('fbp', value);
    setFormField(data.fbpInputName, value);
    storeProcessedValue('fbp', value);
  }
}

// Process GCLID handler
function processGclid() {
  if (!data.enableGclid) {
    return;
  }

  logDebug('Processing GCLID handler');

  var value = getUrlParam('gclid');
  var source = null;

  if (value) {
    source = 'url';
    logDebug('Found gclid in URL: ' + value);
    setTrackerCookie('gclid', value, COOKIE_EXPIRY_DAYS);
    saveToPersistentStorage('gclid', value);
  } else {
    // Check cookie
    value = getCookieValue('gclid');
    if (value) {
      source = 'cookie';
    } else {
      // Check localStorage
      value = getFromPersistentStorage('gclid');
      if (value) {
        source = 'storage';
      }
    }
  }

  if (value) {
    setFormField(data.gclidInputName, value);
    storeProcessedValue('gclid', value);
  }
}

// Process WBRAID handler
function processWbraid() {
  if (!data.enableWbraid) {
    return;
  }

  logDebug('Processing WBRAID handler');

  var value = getUrlParam('wbraid');
  var source = null;

  if (value) {
    source = 'url';
    setTrackerCookie('wbraid', value, COOKIE_EXPIRY_DAYS);
    saveToPersistentStorage('wbraid', value);
  } else {
    value = getCookieValue('wbraid');
    if (value) {
      source = 'cookie';
    } else {
      value = getFromPersistentStorage('wbraid');
      if (value) {
        source = 'storage';
      }
    }
  }

  if (value) {
    setFormField(data.wbraidInputName, value);
    storeProcessedValue('wbraid', value);
  }
}

// Process GBRAID handler
function processGbraid() {
  if (!data.enableGbraid) {
    return;
  }

  logDebug('Processing GBRAID handler');

  var value = getUrlParam('gbraid');
  var source = null;

  if (value) {
    source = 'url';
    setTrackerCookie('gbraid', value, COOKIE_EXPIRY_DAYS);
    saveToPersistentStorage('gbraid', value);
  } else {
    value = getCookieValue('gbraid');
    if (value) {
      source = 'cookie';
    } else {
      value = getFromPersistentStorage('gbraid');
      if (value) {
        source = 'storage';
      }
    }
  }

  if (value) {
    setFormField(data.gbraidInputName, value);
    storeProcessedValue('gbraid', value);
  }
}

// Process UTM parameters
function processUtms() {
  if (!data.enableUtms || !data.utmMappings) {
    return;
  }

  logDebug('Processing UTM handlers');

  var mappings = data.utmMappings;

  for (var i = 0; i < mappings.length; i++) {
    var mapping = mappings[i];
    var utmParam = mapping.utmParam;
    var formField = mapping.formField;

    if (!utmParam || !formField) {
      continue;
    }

    var value = getUrlParam(utmParam);
    var source = null;

    if (value) {
      source = 'url';
      logDebug('Found ' + utmParam + ' in URL: ' + value);
      saveToPersistentStorage(utmParam, value);
    } else {
      // Check localStorage
      value = getFromPersistentStorage(utmParam);
      if (value) {
        source = 'storage';
        logDebug('Using persisted ' + utmParam + ': ' + value);
      }
    }

    if (value) {
      setFormField(formField, value);
      storeProcessedValue(utmParam, value);
    }
  }
}

// Process User Agent
// Note: GTM sandbox cannot access navigator.userAgent directly
// We set a marker that the DOM helper will use to populate the actual value
function processUserAgent() {
  if (!data.enableUserAgent) {
    return;
  }

  logDebug('Processing User Agent handler');

  // Store request for DOM helper to fulfill
  var uphConfig = copyFromWindow('_uphConfig') || {};
  uphConfig.userAgentField = data.userAgentInputName;
  uphConfig.enablePersistence = data.enablePersistence;
  uphConfig.persistencePrefix = PERSISTENCE_PREFIX;
  setInWindow('_uphConfig', uphConfig, true);

  logDebug('User Agent capture requested for field: ' + data.userAgentInputName);
}

// Process Client IP via JSONP
function processClientIp() {
  if (!data.enableClientIp) {
    return;
  }

  logDebug('Processing Client IP handler');

  // Check if we have a persisted IP first
  var persistedIp = getFromPersistentStorage('clientIp');
  if (persistedIp) {
    logDebug('Using persisted IP: ' + persistedIp);
    setFormField(data.clientIpInputName, persistedIp);
    storeProcessedValue('clientIp', persistedIp);
    return;
  }

  // Set up JSONP callback
  var callbackName = '_uphIpCallback';

  setInWindow(callbackName, function(ip) {
    if (ip) {
      var trimmedIp = makeString(ip).split(' ').join('').split('\n').join('');
      logDebug('Received IP: ' + trimmedIp);
      setFormField(data.clientIpInputName, trimmedIp);
      storeProcessedValue('clientIp', trimmedIp);
      saveToPersistentStorage('clientIp', trimmedIp);
    }
  }, true);

  // Inject JSONP script from ipify.org
  var url = 'https://api.ipify.org?format=jsonp&callback=' + callbackName;

  injectScript(
    url,
    function() {
      logDebug('IP script loaded successfully');
    },
    function() {
      logDebug('IP script failed to load');
    },
    'uphIpScript'
  );
}

// Process custom handlers
function processCustomHandlers() {
  if (!data.customHandlers) {
    return;
  }

  logDebug('Processing custom handlers');

  var handlers = data.customHandlers;

  for (var i = 0; i < handlers.length; i++) {
    var handler = handlers[i];
    var id = handler.id;
    var sourceType = handler.sourceType;
    var urlParam = handler.urlParam;
    var cookieName = handler.cookieName;
    var formField = handler.formField;

    if (!id || !formField) {
      continue;
    }

    var value = null;
    var source = null;

    // Try URL first if applicable
    if ((sourceType === SOURCE_TYPE.URL || sourceType === SOURCE_TYPE.URL_OR_COOKIE) && urlParam) {
      value = getUrlParam(urlParam);
      if (value) {
        source = 'url';
        logDebug('Custom handler ' + id + ': found in URL: ' + value);

        // Set cookie if cookie name is specified
        if (cookieName) {
          setTrackerCookie(cookieName, value, COOKIE_EXPIRY_DAYS);
        }
        saveToPersistentStorage(id, value);
      }
    }

    // Try cookie if URL didn't have it
    if (!value && (sourceType === SOURCE_TYPE.COOKIE || sourceType === SOURCE_TYPE.URL_OR_COOKIE) && cookieName) {
      value = getCookieValue(cookieName);
      if (value) {
        source = 'cookie';
        logDebug('Custom handler ' + id + ': found in cookie: ' + value);
      }
    }

    // Try localStorage
    if (!value) {
      value = getFromPersistentStorage(id);
      if (value) {
        source = 'storage';
        logDebug('Custom handler ' + id + ': found in storage: ' + value);
      }
    }

    if (value) {
      setFormField(formField, value);
      storeProcessedValue(id, value);
    }
  }
}

// Main execution
logDebug('Unified Parameter Handler starting');

// Process all enabled handlers
processFbc();
processFbp();
processGclid();
processWbraid();
processGbraid();
processUtms();
processUserAgent();
processClientIp();
processCustomHandlers();

logDebug('Unified Parameter Handler complete');

// Signal success to GTM
data.gtmOnSuccess();


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "get_url",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urlParts",
          "value": {
            "type": 1,
            "string": "any"
          }
        },
        {
          "key": "queriesAllowed",
          "value": {
            "type": 1,
            "string": "any"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "get_cookies",
        "versionId": "1"
      },
      "param": [
        {
          "key": "cookieAccess",
          "value": {
            "type": 1,
            "string": "specific"
          }
        },
        {
          "key": "cookieNames",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "_fbc"
              },
              {
                "type": 1,
                "string": "_fbp"
              },
              {
                "type": 1,
                "string": "gclid"
              },
              {
                "type": 1,
                "string": "wbraid"
              },
              {
                "type": 1,
                "string": "gbraid"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "set_cookies",
        "versionId": "1"
      },
      "param": [
        {
          "key": "allowedCookies",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "name"
                  },
                  {
                    "type": 1,
                    "string": "domain"
                  },
                  {
                    "type": 1,
                    "string": "path"
                  },
                  {
                    "type": 1,
                    "string": "secure"
                  },
                  {
                    "type": 1,
                    "string": "session"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "_fbc"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "name"
                  },
                  {
                    "type": 1,
                    "string": "domain"
                  },
                  {
                    "type": 1,
                    "string": "path"
                  },
                  {
                    "type": 1,
                    "string": "secure"
                  },
                  {
                    "type": 1,
                    "string": "session"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "gclid"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "name"
                  },
                  {
                    "type": 1,
                    "string": "domain"
                  },
                  {
                    "type": 1,
                    "string": "path"
                  },
                  {
                    "type": 1,
                    "string": "secure"
                  },
                  {
                    "type": 1,
                    "string": "session"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "wbraid"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "name"
                  },
                  {
                    "type": 1,
                    "string": "domain"
                  },
                  {
                    "type": 1,
                    "string": "path"
                  },
                  {
                    "type": 1,
                    "string": "secure"
                  },
                  {
                    "type": 1,
                    "string": "session"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "gbraid"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "*"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  },
                  {
                    "type": 1,
                    "string": "any"
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_local_storage",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "uph_*"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "_uphSetField"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "_uphProcessedValues"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "_uphValues"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "_uphIpCallback"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "_uphConfig"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://api.ipify.org/*"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: FBC - URL parameter formats and sets cookie
  code: |-
    var setCookieCalls = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?fbclid=test123abc';
      if (component === 'host') return 'www.example.com';
      return '';
    });
    mock('getCookieValues', function() { return []; });
    mock('setCookie', function(name, value) {
      setCookieCalls.push({name: name, value: value});
    });
    mock('getTimestampMillis', function() { return 1700000000000; });
    mock('setInWindow', function() {});
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: true,
      fbcInputName: 'fbc_field',
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    assertThat(setCookieCalls.length).isEqualTo(1);
    assertThat(setCookieCalls[0].name).isEqualTo('_fbc');
    assertThat(setCookieCalls[0].value).contains('fb.2.1700000000000.test123abc');

- name: FBC - Preserves existing Meta cookie
  code: |-
    var setCookieCalls = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?fbclid=newclick456';
      if (component === 'host') return 'www.example.com';
      return '';
    });
    mock('getCookieValues', function(name) {
      if (name === '_fbc') return ['fb.2.1699900000000.originalclick123'];
      return [];
    });
    mock('setCookie', function(name, value) {
      setCookieCalls.push({name: name, value: value});
    });
    mock('getTimestampMillis', function() { return 1700000000000; });
    mock('setInWindow', function() {});
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: true,
      fbcInputName: 'fbc_field',
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    // Cookie should NOT be set since Meta cookie exists
    assertThat(setCookieCalls.length).isEqualTo(0);

- name: FBP - Reads from cookie
  code: |-
    var valuesStored = [];

    mock('getUrl', function() { return ''; });
    mock('getCookieValues', function(name) {
      if (name === '_fbp') return ['fb.1.1699900000000.123456789'];
      return [];
    });
    mock('setInWindow', function(name, value) {
      valuesStored.push({name: name, value: value});
    });
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: false,
      enableFbp: true,
      fbpInputName: 'fbp_field',
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    // Should store FBP value in _uphValues
    var uphValuesCall = valuesStored.filter(function(c) { return c.name === '_uphValues'; })[0];
    assertThat(uphValuesCall).isNotEqualTo(undefined);

- name: GCLID - Captures and sets cookie
  code: |-
    var setCookieCalls = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?gclid=EAIaIQobChMI_test_gclid';
      return '';
    });
    mock('getCookieValues', function() { return []; });
    mock('setCookie', function(name, value) {
      setCookieCalls.push({name: name, value: value});
    });
    mock('setInWindow', function() {});
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: false,
      enableFbp: false,
      enableGclid: true,
      gclidInputName: 'gclid_field',
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    assertThat(setCookieCalls.length).isEqualTo(1);
    assertThat(setCookieCalls[0].name).isEqualTo('gclid');
    assertThat(setCookieCalls[0].value).isEqualTo('EAIaIQobChMI_test_gclid');

- name: UTM parameters - Stores values
  code: |-
    var valuesStored = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?utm_source=google&utm_medium=cpc';
      return '';
    });
    mock('getCookieValues', function() { return []; });
    mock('setInWindow', function(name, value) {
      valuesStored.push({name: name, value: value});
    });
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: false,
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: true,
      utmMappings: [
        {utmParam: 'utm_source', formField: 'source_field'},
        {utmParam: 'utm_medium', formField: 'medium_field'}
      ],
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    // Should have stored UTM values
    var uphValuesCalls = valuesStored.filter(function(c) { return c.name === '_uphValues'; });
    assertThat(uphValuesCalls.length).isGreaterThan(0);

- name: Subdomain index calculation for www subdomain
  code: |-
    var setCookieCalls = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?fbclid=test1';
      if (component === 'host') return 'www.example.com';
      return '';
    });
    mock('getCookieValues', function() { return []; });
    mock('setCookie', function(name, value) {
      setCookieCalls.push({name: name, value: value});
    });
    mock('getTimestampMillis', function() { return 1700000000000; });
    mock('setInWindow', function() {});
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: true,
      fbcInputName: 'fbc',
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    // For www.example.com (3 parts), index should be 2
    assertThat(setCookieCalls[0].value).contains('fb.2.');

- name: Subdomain index for simple domain
  code: |-
    var setCookieCalls = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?fbclid=test1';
      if (component === 'host') return 'example.com';
      return '';
    });
    mock('getCookieValues', function() { return []; });
    mock('setCookie', function(name, value) {
      setCookieCalls.push({name: name, value: value});
    });
    mock('getTimestampMillis', function() { return 1700000000000; });
    mock('setInWindow', function() {});
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: true,
      fbcInputName: 'fbc',
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false
    });

    // For example.com (2 parts), index should be 1
    assertThat(setCookieCalls[0].value).contains('fb.1.');

- name: Custom handler - Sets cookie
  code: |-
    var setCookieCalls = [];

    mock('getUrl', function(component) {
      if (component === 'query') return '?custom_param=custom_value';
      return '';
    });
    mock('getCookieValues', function() { return []; });
    mock('setCookie', function(name, value) {
      setCookieCalls.push({name: name, value: value});
    });
    mock('setInWindow', function() {});
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: false,
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: false,
      enableClientIp: false,
      enablePersistence: false,
      cookieExpiryDays: '90',
      enableDebug: false,
      customHandlers: [
        {
          id: 'custom1',
          sourceType: 'url',
          urlParam: 'custom_param',
          cookieName: 'custom_cookie',
          formField: 'custom_field'
        }
      ]
    });

    assertThat(setCookieCalls.length).isEqualTo(1);
    assertThat(setCookieCalls[0].name).isEqualTo('custom_cookie');
    assertThat(setCookieCalls[0].value).isEqualTo('custom_value');

- name: User Agent - Stores config for DOM helper
  code: |-
    var configStored = null;

    mock('getUrl', function() { return ''; });
    mock('getCookieValues', function() { return []; });
    mock('setInWindow', function(name, value) {
      if (name === '_uphConfig') {
        configStored = value;
      }
    });
    mock('callInWindow', function() { return false; });
    mock('copyFromWindow', function() { return null; });

    runCode({
      enableFbc: false,
      enableFbp: false,
      enableGclid: false,
      enableWbraid: false,
      enableGbraid: false,
      enableUtms: false,
      enableUserAgent: true,
      userAgentInputName: 'ua_field',
      enableClientIp: false,
      enablePersistence: false,
      persistencePrefix: 'uph_',
      cookieExpiryDays: '90',
      enableDebug: false
    });

    assertThat(configStored).isNotEqualTo(null);
    assertThat(configStored.userAgentField).isEqualTo('ua_field');


___NOTES___

Created on 2/3/2026

Unified Parameter Handler GTM Template v1.0.0

This template captures tracking parameters from URLs and cookies,
then injects them into hidden form fields for CRM submission.

Features:
- Facebook: fbclid (_fbc), _fbp cookie
- Google: gclid, wbraid, gbraid
- UTM parameters with custom mappings
- User Agent capture
- Client IP via JSONP (ipify.org)
- localStorage persistence for cross-page tracking
- Custom parameter handlers

Limitations compared to webpack build:
- No retry mechanism (setTimeout not available in sandbox)
- No MutationObserver for form monitoring
- IP fetch is async via JSONP

For more information, see:
https://github.com/atomicagility/unified-param-handler


