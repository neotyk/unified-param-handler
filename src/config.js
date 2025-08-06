// src/config.js
import { formatFbClickId } from './utils.js';
import { SourceType } from './constants.js';

/**
 * @typedef {Object} HandlerConfig
 * @property {string} id - Unique internal identifier (e.g., 'fbc', 'gclid', 'utm_source'). Used mainly for logging.
 * @property {SourceType} sourceType - Where to look for the value.
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
 * @property {boolean} [persist] - If true, the found value will be saved to localStorage and retrieved on subsequent page loads if not found in the URL/cookie.
 * @property {object} [retryMechanism] - Optional configuration for retrying cookie reads. Only applies if sourceType includes 'cookie'.
 * @property {boolean} [retryMechanism.enabled] - Enable retry if cookie not found initially?
 * @property {number} [retryMechanism.maxAttempts] - Maximum number of retry attempts.
 * @property {number} [retryMechanism.interval] - Delay between retries in milliseconds.
 * @property {object} [reporting] - Optional configuration for reporting found values to analytics services.
 * @property {boolean} [reporting.msClarity] - If true, report the found value to Microsoft Clarity.
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
    sourceType: SourceType.URL_OR_COOKIE,
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
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'fbp',
    sourceType: SourceType.COOKIE,
    cookieName: '_fbp',
    targetInputName: 'custom FBP', // Example name, adjust as needed
    retryMechanism: {
      enabled: true,
      maxAttempts: 5,
      interval: 5000,
    },
    reporting: {
      msClarity: true,
    },
  },

  // --- Google Handlers ---
  {
    id: 'gclid',
    sourceType: SourceType.URL,
    urlParamName: 'gclid',
    targetInputName: 'custom GCLID', // Example name, adjust as needed
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'gclid',
      daysToExpiry: 90,
    },
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'wbraid',
    sourceType: SourceType.URL,
    urlParamName: 'wbraid',
    targetInputName: 'custom WBRAID', // Example name, adjust as needed
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'wbraid',
      daysToExpiry: 90,
    },
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'gbraid',
    sourceType: SourceType.URL,
    urlParamName: 'gbraid',
    targetInputName: 'custom GBRAID', // Example name, adjust as needed
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'gbraid',
      daysToExpiry: 90,
    },
    reporting: {
      msClarity: true,
    },
  },

  // --- UTM Handlers ---
  {
    id: 'utm_source',
    sourceType: SourceType.URL,
    urlParamName: 'utm_source',
    targetInputName: 'custom UTM_SOURCE',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_medium',
    sourceType: SourceType.URL,
    urlParamName: 'utm_medium',
    targetInputName: 'custom UTM_MEDIUM',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_campaign',
    sourceType: SourceType.URL,
    urlParamName: 'utm_campaign',
    targetInputName: 'custom UTM_CAMPAIGN',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_term',
    sourceType: SourceType.URL,
    urlParamName: 'utm_term',
    targetInputName: 'custom UTM_TERM',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_content',
    sourceType: SourceType.URL,
    urlParamName: 'utm_content',
    targetInputName: 'custom UTM_CONTENT',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_id',
    sourceType: SourceType.URL,
    urlParamName: 'utm_id',
    targetInputName: 'custom UTM_ID',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_pub',
    sourceType: SourceType.URL,
    urlParamName: 'utm_pub',
    targetInputName: 'custom UTM_PUB',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_size',
    sourceType: SourceType.URL,
    urlParamName: 'utm_size',
    targetInputName: 'custom UTM_SIZE',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'utm_broker',
    sourceType: SourceType.URL,
    urlParamName: 'utm_broker',
    targetInputName: 'custom UTM_BROKER',
    persist: true,
    reporting: {
      msClarity: true,
    },
  },
  // Add more UTMs or other parameters here following the pattern

  // --- Browser/Client Info ---
  {
    id: 'userAgent',
    sourceType: SourceType.USER_AGENT, // Special source type for User Agent
    targetInputName: 'userAgent', // Target input name
    // No URL param or cookie needed
    reporting: {
      msClarity: true,
    },
  },
  {
    id: 'clientIp',
    sourceType: SourceType.IP_ADDRESS, // Special source type for Client IP
    targetInputName: 'clientIp', // Target input name
    // No URL param or cookie needed
    reporting: {
      msClarity: true,
    },
  },
];
