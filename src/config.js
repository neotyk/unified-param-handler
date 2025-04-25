// src/config.js
import { formatFbClickId } from './utils.js'; // Import needed functions

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
    // No sourceType needed as it's read directly from navigator
    targetInputName: 'custom USER_AGENT', // Example name
  },
];
