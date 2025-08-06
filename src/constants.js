/**
 * @file src/constants.js
 * @description Defines constants used throughout the application.
 */

/**
 * Enum for handler source types.
 * @readonly
 * @enum {string}
 */
export const SourceType = {
  URL: 'url',
  COOKIE: 'cookie',
  URL_OR_COOKIE: 'url_or_cookie',
  USER_AGENT: 'user_agent',
  IP_ADDRESS: 'ip_address',
};
