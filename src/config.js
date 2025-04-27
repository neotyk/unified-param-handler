// src/config.js
import { formatFbClickId } from './utils.js';

/**
 * @typedef {Object} HandlerConfig
 * @property {string} id - Unique internal identifier (e.g., 'fbc', 'gclid', 'utm_source'). Used mainly for logging.
 * @property {'url'|'cookie'|'url_or_cookie'|'user_agent'|'ip_address'} sourceType - Where to look for the value.
 *   - 'url': Check URL query parameters only.
 *   - 'cookie': Check document cookies only.
 *   - 'url_or_cookie': Check URL first, then cookie if not found in URL.
 *   - 'user_agent': Get the browser's User Agent string.
 *   - 'ip_address': Attempt to fetch the client's IP address (requires a supporting endpoint).
 * @property {string} [urlParamName] - The exact name of the URL query parameter. Required if sourceType includes 'url'.
 * @property {string} [cookieName] - The exact name of the cookie. Required if sourceType includes 'cookie'.
 * @property {string} targetInputName - The 'name' attribute of the target hidden input field.
 * @property {function(string): string} [applyFormatting] - Optional function to format the raw value before setting it. Receives the raw value.
 * @property {object} [setCookie] - Optional configuration for setting/updating a cookie based on a found value.
 * @property {boolean} [setCookie.enabledOnUrlHit] - Set the cookie if the value was found in the URL?
 * @property {string} [setCookie.cookieNameToSet] - The name of the cookie to set/update.
 * @property {number} [setCookie.daysToExpiry] - Lifespan of the cookie in days.
 * @property {object} [retryMechanism] - Optional configuration for retrying cookie reads. Only applies if sourceType includes 'cookie'.
 * @property {boolean} [retryMechanism.enabled] - Enable retry if cookie not found initially?
 * @property {number} [retryMechanism.maxAttempts] - Maximum number of retry attempts.
 * @property {number} [retryMechanism.interval] - Delay between retries in milliseconds.
 */

/**
 * Default configuration array for common tracking parameters.
 * Each object defines how to handle one parameter/cookie according to the HandlerConfig type.
 * @type {HandlerConfig[]}
 */
export const defaultHandlerConfigs = [
  // --- Facebook Handlers ---
  {
    id: 'fbc',
    sourceType: 'url_or_cookie',
    urlParamName: 'fbclid',
    cookieName: '_fbc',
    targetInputName: 'custom FBC', // Example name, adjust as needed
    applyFormatting: formatFbClickId, // Reference to the formatting function
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
    targetInputName: 'custom FBP', // Example name, adjust as needed
    retryMechanism: {
      enabled: true,
      maxAttempts: 5,
      interval: 5000,
    },
  },

  // --- Google Handlers ---
  {
    id: 'gclid',
    sourceType: 'url',
    urlParamName: 'gclid',
    targetInputName: 'custom GCLID', // Example name, adjust as needed
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'gclid',
      daysToExpiry: 90,
    },
  },
  {
    id: 'wbraid',
    sourceType: 'url',
    urlParamName: 'wbraid',
    targetInputName: 'custom WBRAID', // Example name, adjust as needed
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'wbraid',
      daysToExpiry: 90,
    },
  },
  {
    id: 'gbraid',
    sourceType: 'url',
    urlParamName: 'gbraid',
    targetInputName: 'custom GBRAID', // Example name, adjust as needed
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'gbraid',
      daysToExpiry: 90,
    },
  },

  // --- UTM Handlers ---
  {
    id: 'utm_source',
    sourceType: 'url',
    urlParamName: 'utm_source',
    targetInputName: 'custom UTM_SOURCE',
  },
  {
    id: 'utm_medium',
    sourceType: 'url',
    urlParamName: 'utm_medium',
    targetInputName: 'custom UTM_MEDIUM',
  },
  {
    id: 'utm_campaign',
    sourceType: 'url',
    urlParamName: 'utm_campaign',
    targetInputName: 'custom UTM_CAMPAIGN',
  },
  {
    id: 'utm_term',
    sourceType: 'url',
    urlParamName: 'utm_term',
    targetInputName: 'custom UTM_TERM',
  },
  {
    id: 'utm_content',
    sourceType: 'url',
    urlParamName: 'utm_content',
    targetInputName: 'custom UTM_CONTENT',
  },
  {
    id: 'utm_id',
    sourceType: 'url',
    urlParamName: 'utm_id',
    targetInputName: 'custom UTM_ID',
  },
  {
    id: 'utm_pub',
    sourceType: 'url',
    urlParamName: 'utm_pub',
    targetInputName: 'custom UTM_PUB',
  },
  {
    id: 'utm_size',
    sourceType: 'url',
    urlParamName: 'utm_size',
    targetInputName: 'custom UTM_SIZE',
  },
  {
    id: 'utm_broker',
    sourceType: 'url',
    urlParamName: 'utm_broker',
    targetInputName: 'custom UTM_BROKER',
  },
  // Add more UTMs or other parameters here following the pattern

  // --- Browser/Client Info ---
  {
    id: 'userAgent',
    sourceType: 'user_agent', // Special source type for User Agent
    targetInputName: 'userAgent', // Target input name
    // No URL param or cookie needed
  },
  {
    id: 'clientIp',
    sourceType: 'ip_address', // Special source type for Client IP
    targetInputName: 'clientIp', // Target input name
    // No URL param or cookie needed
  },
];
