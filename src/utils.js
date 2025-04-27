// src/utils.js

/**
 * Parsed URL query parameters.
 * @type {URLSearchParams}
 */
export const URL_PARAMS = new URLSearchParams(window.location.search);

/**
 * Checks if the debug mode is enabled via the 'debug=true' URL parameter.
 * @returns {boolean} True if debug mode is active, false otherwise.
 */
export function isDebugMode() {
  // Check the live value each time
  return (
    typeof window !== 'undefined' &&
    window.location.search.includes('debug=true')
  );
}

/**
 * Logs an error message to the console.
 * @param {string} message - The error message to log.
 */
export function logError(message) {
  console.error(`[Unified Param Handler Error]: ${message}`);
  // Removed alert fallback - generally not desired for production scripts
}

/**
 * Logs a debug message to the console if debug mode is enabled.
 * @param {string} message - The debug message.
 * @param {...any} args - Additional arguments to log.
 */
export function logDebug(message, ...args) {
  if (isDebugMode() && typeof console !== 'undefined' && console.log) {
    console.log(`[Unified Param Handler] ${message}`, ...args);
  }
}

/**
 * Starts a collapsed or expanded console group if debug mode is enabled.
 * @param {string} name - The name of the console group.
 * @param {boolean} [collapsed=false] - Whether the group should be collapsed by default.
 */
export function startGroup(name, collapsed = false) {
  if (isDebugMode() && typeof console !== 'undefined') {
    const groupMethod = collapsed ? console.groupCollapsed : console.group;
    if (groupMethod) {
      groupMethod(`[Unified Param Handler] ${name}`);
    }
  }
}

/**
 * Ends the current console group if debug mode is enabled.
 */
export function endGroup() {
  if (isDebugMode() && typeof console !== 'undefined' && console.groupEnd) {
    console.groupEnd();
  }
}

/**
 * Parses the document.cookie string into an object of key-value pairs.
 * Handles URL decoding and potential errors.
 * @returns {Object<string, string>} An object containing the parsed cookies.
 */
export function parseCookies() {
  startGroup('Parsing Cookies', true);
  const cookies = {};
  if (document.cookie && document.cookie !== '') {
    document.cookie.split(';').forEach(function (cookie) {
      const eqPos = cookie.indexOf('=');
      if (eqPos > 0) {
        // Ensure '=' is found and not the first char
        const name = cookie.substring(0, eqPos).trim();
        let value = cookie.substring(eqPos + 1).trim();
        // Decode cookie value, handle potential quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        try {
          cookies[name] = decodeURIComponent(value);
        } catch (e) {
          cookies[name] = value; // Fallback to raw value if decoding fails
          logError(`Failed to decode cookie "${name}": ${e.message}`);
        }
      }
    });
  }
  logDebug('Parsed cookies:', cookies);
  endGroup();
  return cookies;
}

/**
 * Retrieves the value of a specific cookie.
 * Always re-parses the cookies from document.cookie.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value or null if not found.
 */
export function getCookie(name) {
  // Always parse fresh cookies
  const currentCookies = parseCookies();
  logDebug(`Getting cookie '${name}':`, currentCookies[name]);
  return currentCookies[name] || null;
}

/**
 * Sets a cookie with the given name, value, and expiration days.
 * Uses SameSite=Lax for security.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
export function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  // Encode the value for safety
  const encodedValue = encodeURIComponent(value);
  document.cookie =
    name + '=' + encodedValue + expires + '; path=/; SameSite=Lax'; // Added SameSite=Lax for good practice
  logDebug(`Cookie set: ${name} = ${value} (Expires in ${days} days)`);
}

/**
 * Calculates the subdomain index required for Facebook's _fbc cookie format.
 * Tries to handle localhost, IP addresses, and common domain structures.
 * @returns {number} The calculated subdomain index (usually 1 or 2).
 */
export function getSubdomainIndex() {
  const hostname = window.location.hostname;
  // Basic check for localhost or IP - might need refinement for edge cases
  if (hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return 1; // Default for local/IP
  }
  if (hostname === 'com') return 0; // Original check
  const parts = hostname.split('.');
  // Handle cases like example.com (length 2 -> index 1)
  // and www.example.com (length 3 -> index 2)
  // Consider TLDs like .co.uk - this simple logic might need adjustment if specific FB requirements differ.
  return Math.max(1, parts.length - 1); // Ensure at least 1
}

/**
 * Formats a Facebook Click ID (fbclid) into the required _fbc cookie format.
 * Format: fb.{subdomainIndex}.{creationTime}.{fbclid}
 * @param {string} fbclid - The raw Facebook Click ID from the URL.
 * @returns {string|null} The formatted _fbc value or null if no fbclid is provided.
 */
export function formatFbClickId(fbclid) {
  if (!fbclid) return null;
  const subdomainIndex = getSubdomainIndex();
  const creationTime = Date.now();
  return `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
}
