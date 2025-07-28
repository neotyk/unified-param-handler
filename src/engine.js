// src/engine.js
import * as utils from './utils.js';
// defaultHandlerConfigs will be from src/config.js or src/dummy-config.js based on build
import { defaultHandlerConfigs } from './config.js';
import { formatFbClickId } from './utils.js';

/**
 * @typedef {import('./config.js').HandlerConfig} HandlerConfig
 */

// Map of known formatter string names to their actual functions
const knownFormatters = {
  formatFbClickId: formatFbClickId,
  // Add other known formatters here if needed in the future
};

/**
 * Waits for a specific cookie to appear and updates the target element if found.
 * This function implements a retry mechanism with configurable attempts and interval.
 * It's invoked only when an initial cookie check fails and the handler configuration enables retry.
 *
 * @param {string} cookieName - The name of the cookie to wait for.
 * @param {HTMLInputElement|HTMLTextAreaElement} element - The DOM element to update.
 * @param {HandlerConfig['retryMechanism']} retryConfig - The retry configuration object from the handler config.
 * @param {number} [initialAttemptCount=1] - The starting attempt number for logging purposes.
 */
function waitForCookieAndUpdateInput(
  cookieName,
  element, // Changed from inputElement to element
  retryConfig,
  initialAttemptCount = 1
) {
  let attempts = initialAttemptCount;
  const maxAttempts = retryConfig.maxAttempts || 5;
  const interval = retryConfig.interval || 5000;

  function checkCookieWithRetry() {
    utils.startGroup(
      `Retrying for ${cookieName} Cookie (Attempt ${attempts}/${maxAttempts})`,
      true
    );

    const cookieValue = utils.getCookie(cookieName);

    if (cookieValue) {
      element.value = cookieValue; // Use element
      utils.logDebug(
        `Element '[name="${element.name}"]' updated from RETRIED cookie '${cookieName}':`, // Updated log
        cookieValue
      );
      utils.endGroup();
      return;
    }

    attempts++;
    if (attempts > maxAttempts) {
      utils.logError(
        `Failed to find ${cookieName} cookie after ${maxAttempts} total attempts. Element '[name="${element.name}"]' might remain empty or unchanged.` // Updated log
      );
      utils.endGroup();
      return;
    }

    utils.logDebug(
      `Cookie ${cookieName} still not found. Will retry again in ${
        interval / 1000
      } seconds.`
    );
    setTimeout(checkCookieWithRetry, interval);
    utils.endGroup();
  }

  utils.logDebug(
    `Cookie ${cookieName} not found initially. Starting retry checks (Attempt ${attempts}).`
  );
  setTimeout(checkCookieWithRetry, interval);
}

/**
 * Processes a single handler configuration.
 * This function is now focused on finding the final value for a handler
 * and updating the input field if it exists on the page.
 *
 * @param {HandlerConfig} config - A single handler configuration object.
 */
function processHandler(config) {
  utils.startGroup(`Processing Handler: ${config.id}`, true);

  // --- 1. Find a fresh value from URL or Cookie ---
  let freshValue = null;
  let valueSource = null;

  if (config.sourceType.includes('url') && config.urlParamName) {
    const urlVal = utils.getUrlParams().get(config.urlParamName);
    if (urlVal !== null) {
      freshValue = urlVal;
      valueSource = 'url';
    }
  }

  if (
    freshValue === null &&
    config.sourceType.includes('cookie') &&
    config.cookieName
  ) {
    const cookieVal = utils.getCookie(config.cookieName);
    if (cookieVal !== null) {
      freshValue = cookieVal;
      valueSource = 'cookie';
    }
  }

  // --- 2. If a fresh value was found from the URL, format and persist it ---
  if (valueSource === 'url') {
    utils.logDebug(
      `Found fresh value for '${config.id}' from URL:`,
      freshValue
    );
    let valueToPersist = freshValue;

    // Apply formatting
    let formatterFunction = null;
    if (typeof config.applyFormatting === 'function') {
      formatterFunction = config.applyFormatting;
    } else if (typeof config.applyFormatting === 'string') {
      formatterFunction = knownFormatters[config.applyFormatting];
    }
    if (formatterFunction) {
      try {
        const formatted = formatterFunction(freshValue);
        if (formatted !== null && formatted !== undefined) {
          valueToPersist = formatted;
          utils.logDebug(`Formatted value for '${config.id}':`, valueToPersist);
        }
      } catch (e) {
        utils.logError(
          `Error applying formatting function for handler '${config.id}': ${e.message}.`
        );
      }
    }

    // Persist if configured
    if (config.persist) {
      utils.saveToPersistentStorage(config.id, valueToPersist);
    }
    // Set cookie if configured
    if (config.setCookie && config.setCookie.enabledOnUrlHit) {
      utils.setCookie(
        config.setCookie.cookieNameToSet,
        valueToPersist,
        config.setCookie.daysToExpiry
      );
    }
    // The fresh, formatted, persisted value is the one we'll use for the input
    freshValue = valueToPersist;
  } else if (valueSource === 'cookie') {
    utils.logDebug(
      `Found fresh value for '${config.id}' from Cookie:`,
      freshValue
    );
  }

  // --- 3. Determine the final value for the input field ---
  let finalValue = freshValue; // Start with the fresh value (which could be null)
  if (finalValue === null && config.persist) {
    const persistedValue = utils.getFromPersistentStorage(config.id);
    if (persistedValue !== null) {
      finalValue = persistedValue;
      valueSource = 'storage'; // Update source for logging
      utils.logDebug(`Using persisted value for '${config.id}':`, finalValue);
    }
  }

  // --- 4. Update Input Field (if it exists) ---
  if (config.targetInputName) {
    const targetElements = document.querySelectorAll(
      `input[name="${config.targetInputName}"], textarea[name="${config.targetInputName}"]`
    );

    if (targetElements.length > 0) {
      targetElements.forEach((element) => {
        if (finalValue !== null) {
          element.value = finalValue;
          utils.logDebug(
            `Element '[name="${config.targetInputName}"]' updated. Source: ${
              valueSource || 'none'
            }.`
          );
        } else {
          element.value = '';
          utils.logDebug(
            `No value found for '${config.id}', cleared element '[name="${config.targetInputName}"]'.`
          );
        }
        // Handle cookie retry only if no value could be found from any source
        if (
          finalValue === null &&
          config.sourceType.includes('cookie') &&
          config.retryMechanism &&
          config.retryMechanism.enabled
        ) {
          waitForCookieAndUpdateInput(
            config.cookieName,
            element, // Pass the specific element to the retry function
            config.retryMechanism,
            1
          );
        }
      });
    } else {
      utils.logDebug(
        `No elements found with name '${config.targetInputName}' on this page.`
      );
    }
  } else if (freshValue === null) {
    utils.logDebug(
      `No value found for '${config.id}' and no targetInputName specified.`
    );
  }

  utils.endGroup();
}

/**
 * Fetches the client's IP address from an external service and updates the target element.
 * Includes a timeout to prevent race conditions.
 * @private
 * @param {HTMLInputElement|HTMLTextAreaElement} element - The element to update with the IP address.
 * @param {string} targetInputName - The name attribute of the element (for logging).
 */
function fetchClientIpAndUpdateInput(element, targetInputName) {
  // Changed from inputElement to element
  utils.logDebug(
    `Fetching Client IP for element '[name="${targetInputName}"]'...`
  ); // Updated log

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  fetch('https://checkip.amazonaws.com/', { signal: controller.signal })
    .then((res) => {
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then((ip) => {
      const trimmedIp = ip.trim();
      element.value = trimmedIp; // Use element
      utils.logDebug(
        `Element '[name="${targetInputName}"]' updated with Client IP:`, // Updated log
        trimmedIp
      );
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      let errorMessage;
      if (error.name === 'AbortError') {
        errorMessage = 'IP_FETCH_TIMED_OUT';
        utils.logError(`IP fetch for '[name="${targetInputName}"]' timed out.`);
      } else {
        errorMessage = 'IP_FETCH_FAILED';
        utils.logError(
          `Failed to fetch Client IP for '[name="${targetInputName}"]': ${error.message}`
        );
      }
      element.value = errorMessage; // Use element
    });
}

/**
 * Initializes the Unified Parameter Handler.
 */
export function init(customConfigs) {
  // customConfigs argument is from runtime
  utils.startGroup('Initializing Unified Parameter Handler');

  // --- Configuration Loading (No changes needed here, it's correct) ---
  let baseConfigs;
  if (
    typeof WEBPACK_BUILD_HAS_FIXED_CONFIG !== 'undefined' &&
    WEBPACK_BUILD_HAS_FIXED_CONFIG
  ) {
    utils.logDebug('Build has a fixed configuration.');
    if (
      typeof WEBPACK_CUSTOM_CONFIGS !== 'undefined' &&
      WEBPACK_CUSTOM_CONFIGS
    ) {
      if (Array.isArray(WEBPACK_CUSTOM_CONFIGS)) {
        baseConfigs = WEBPACK_CUSTOM_CONFIGS;
      } else if (
        WEBPACK_CUSTOM_CONFIGS.default &&
        Array.isArray(WEBPACK_CUSTOM_CONFIGS.default)
      ) {
        baseConfigs = WEBPACK_CUSTOM_CONFIGS.default;
      } else {
        utils.logError(
          'WEBPACK_CUSTOM_CONFIGS is not a valid array or an object with a default array property.'
        );
        baseConfigs = [];
      }
      utils.logDebug(
        'Using WEBPACK_CUSTOM_CONFIGS provided at build time.',
        baseConfigs
      );
    } else {
      utils.logDebug(
        'Using defaultHandlerConfigs (potentially filtered by WEBPACK_CONFIG_NAME).'
      );
      baseConfigs = defaultHandlerConfigs;
    }
    if (customConfigs) {
      utils.logDebug(
        'Runtime customConfigs argument ignored due to fixed build configuration.'
      );
    }
  } else {
    utils.logDebug(
      'Build does not have a fixed configuration. Runtime configs can be used.'
    );
    if (Array.isArray(customConfigs) && customConfigs.length > 0) {
      utils.logDebug('Using customConfigs provided at runtime.');
      baseConfigs = customConfigs;
    } else {
      utils.logDebug('Using defaultHandlerConfigs from src/config.js.');
      baseConfigs = defaultHandlerConfigs;
    }
  }

  let configsToUse = baseConfigs;
  if (typeof WEBPACK_CONFIG_NAME !== 'undefined' && WEBPACK_CONFIG_NAME) {
    utils.logDebug(
      `Webpack build specified configName to filter: ${WEBPACK_CONFIG_NAME}`
    );
    if (Array.isArray(baseConfigs)) {
      const singleConfig = baseConfigs.find(
        (c) => c.id === WEBPACK_CONFIG_NAME
      );
      if (singleConfig) {
        configsToUse = [singleConfig];
        utils.logDebug(
          `Filtered to use only specified config ID: ${WEBPACK_CONFIG_NAME}`,
          configsToUse
        );
      } else {
        utils.logError(
          `Specified configName '${WEBPACK_CONFIG_NAME}' not found in the chosen base configurations. Using all chosen base configurations.`
        );
      }
    } else {
      utils.logError(
        'Base configurations are not an array, cannot filter by WEBPACK_CONFIG_NAME.'
      );
      configsToUse = [];
    }
  }

  utils.logDebug('Final configurations to use:', configsToUse);

  if (!Array.isArray(configsToUse) || configsToUse.length === 0) {
    utils.logError('Handler configurations are missing or empty.');
    utils.endGroup();
    return;
  }

  // --- Handler Processing Loop (This is the refactored part) ---
  configsToUse.forEach((config) => {
    if (
      !config ||
      typeof config !== 'object' ||
      !config.id ||
      !config.sourceType
    ) {
      utils.logError(
        `Invalid or incomplete handler config: ${JSON.stringify(
          config
        )}. Skipping.`
      );
      return;
    }

    try {
      // Handle special, direct-injection types first
      if (
        config.sourceType === 'user_agent' ||
        config.sourceType === 'ip_address'
      ) {
        if (!config.targetInputName) {
          utils.logError(
            `Handler '${config.id}' requires a targetInputName. Skipping.`
          );
          return; // Use 'return' since we're inside a forEach
        }
        const targetElements = document.querySelectorAll(
          `input[name="${config.targetInputName}"], textarea[name="${config.targetInputName}"]`
        );
        if (targetElements.length === 0) {
          utils.logDebug(
            `No elements found with name '${config.targetInputName}' for handler '${config.id}'.`
          );
          return;
        }

        targetElements.forEach((element) => {
          // Now, apply the specific logic to each found element
          if (config.sourceType === 'user_agent') {
            if (typeof navigator !== 'undefined' && navigator.userAgent) {
              element.value = navigator.userAgent;
              utils.logDebug(
                `Element '[name="${config.targetInputName}"]' updated with User Agent.`
              );
            } else {
              element.value = 'USER_AGENT_NOT_FOUND'; // Sentinel value
              utils.logError(
                `navigator.userAgent not available for element '[name="${config.targetInputName}"]'.`
              );
            }
          } else if (config.sourceType === 'ip_address') {
            fetchClientIpAndUpdateInput(element, config.targetInputName);
          }
        });
      }
      // Handle URL/Cookie/Storage types
      else if (['url', 'cookie', 'url_or_cookie'].includes(config.sourceType)) {
        processHandler(config);
      }
      // Handle unknown types
      else {
        utils.logError(
          `Unknown sourceType '${config.sourceType}' for handler '${config.id}'. Skipping.`
        );
      }
    } catch (error) {
      utils.logError(
        `Unexpected error processing handler '${config.id}': ${error.message}`
      );
      console.error(error);
    }
  });

  utils.logDebug('Finished processing configurations.');
  utils.endGroup();
}
