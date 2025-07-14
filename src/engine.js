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
 * Waits for a specific cookie to appear and updates the target input field if found.
 * This function implements a retry mechanism with configurable attempts and interval.
 * It's invoked only when an initial cookie check fails and the handler configuration enables retry.
 *
 * @param {string} cookieName - The name of the cookie to wait for.
 * @param {HTMLInputElement} inputElement - The DOM element of the target hidden input field.
 * @param {HandlerConfig['retryMechanism']} retryConfig - The retry configuration object from the handler config.
 * @param {number} [initialAttemptCount=1] - The starting attempt number for logging purposes.
 */
function waitForCookieAndUpdateInput(
  cookieName,
  inputElement,
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

    const cookieValue = utils.getCookie(cookieName); // Get fresh cookies

    if (cookieValue) {
      // --- Cookie Found on Retry ---
      inputElement.value = cookieValue;
      utils.logDebug(
        `Input field '${inputElement.name}' updated from RETRIED cookie '${cookieName}':`,
        cookieValue
      );
      utils.endGroup();
      return; // Success: Stop retrying.
    }

    // --- Cookie Not Found ---
    attempts++;
    if (attempts > maxAttempts) {
      // --- Max Attempts Reached ---
      utils.logError(
        `Failed to find ${cookieName} cookie after ${maxAttempts} total attempts. Input field '${inputElement.name}' might remain empty or unchanged.`
      );
      utils.endGroup();
      return; // Failure: Stop retrying.
    }

    // --- Schedule Next Attempt ---
    utils.logDebug(
      `Cookie ${cookieName} still not found. Will retry again in ${
        interval / 1000
      } seconds.`
    );
    setTimeout(checkCookieWithRetry, interval);
    utils.endGroup();
  }

  // Start the first retry check (via setTimeout)
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
    const inputElement = document.querySelector(
      `input[name="${config.targetInputName}"]`
    );
    if (inputElement) {
      if (finalValue !== null) {
        inputElement.value = finalValue;
        utils.logDebug(
          `Input field '${config.targetInputName}' updated. Source: ${
            valueSource || 'none'
          }.`
        );
      } else {
        inputElement.value = '';
        utils.logDebug(
          `No value found for '${config.id}', cleared input field '${config.targetInputName}'.`
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
          inputElement,
          config.retryMechanism,
          1
        );
      }
    } else {
      utils.logDebug(
        `Input field '${config.targetInputName}' not found on this page.`
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
 * Fetches the client's IP address from an external service and updates the target input field.
 * @private
 * @param {HTMLInputElement} inputElement The input field to update with the IP address.
 * @param {string} targetInputName The name attribute of the input field (for logging).
 */
function fetchClientIpAndUpdateInput(inputElement, targetInputName) {
  utils.logDebug(`Fetching Client IP for input '${targetInputName}'...`);
  fetch('https://checkip.amazonaws.com/') // Simple public service
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then((ip) => {
      const trimmedIp = ip.trim(); // Trim whitespace
      inputElement.value = trimmedIp;
      utils.logDebug(
        `Input field '${targetInputName}' updated with Client IP:`,
        trimmedIp
      );
    })
    .catch((error) => {
      utils.logError(
        `Failed to fetch Client IP for '${targetInputName}': ${error.message}`
      );
      // Optionally clear the input or leave it as is
      // inputElement.value = '';
    });
}

/**
 * Initializes the Unified Parameter Handler.
 */
export function init(customConfigs) {
  // customConfigs argument is from runtime
  utils.startGroup('Initializing Unified Parameter Handler');

  let baseConfigs;

  if (
    typeof WEBPACK_BUILD_HAS_FIXED_CONFIG !== 'undefined' &&
    WEBPACK_BUILD_HAS_FIXED_CONFIG
  ) {
    utils.logDebug('Build has a fixed configuration.');
    if (
      typeof WEBPACK_CUSTOM_CONFIGS !== 'undefined' &&
      WEBPACK_CUSTOM_CONFIGS // Check if it's not null/undefined
    ) {
      // If customConfigPath was used, WEBPACK_CUSTOM_CONFIGS is the content of that file.
      // It might be an object { default: [...] } if the custom config uses export default,
      // or a direct array if it uses module.exports = [...].
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
        baseConfigs = []; // Fallback to empty if structure is unexpected
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
    // Standard behavior: runtime customConfigs take precedence over defaults
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

  // Filter if WEBPACK_CONFIG_NAME is set (applies to both fixed and non-fixed config builds)
  if (typeof WEBPACK_CONFIG_NAME !== 'undefined' && WEBPACK_CONFIG_NAME) {
    utils.logDebug(
      `Webpack build specified configName to filter: ${WEBPACK_CONFIG_NAME}`
    );
    // Ensure baseConfigs is an array before trying to find
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
      configsToUse = []; // Or handle as an error appropriately
    }
  }

  utils.logDebug('Final configurations to use:', configsToUse);

  if (!Array.isArray(configsToUse) || configsToUse.length === 0) {
    utils.logError('Handler configurations are missing or empty.');
    utils.endGroup();
    return;
  }

  configsToUse.forEach((config) => {
    // Basic validation
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
      switch (config.sourceType) {
        case 'user_agent':
        case 'ip_address':
          // These require a target input, so we handle them simply.
          if (config.targetInputName) {
            const inputElement = document.querySelector(
              `input[name="${config.targetInputName}"]`
            );
            if (inputElement) {
              if (
                config.sourceType === 'user_agent' &&
                typeof navigator !== 'undefined' &&
                navigator.userAgent
              ) {
                inputElement.value = navigator.userAgent;
                utils.logDebug(
                  `Input field '${config.targetInputName}' updated with User Agent.`
                );
              } else if (config.sourceType === 'ip_address') {
                fetchClientIpAndUpdateInput(
                  inputElement,
                  config.targetInputName
                );
              }
            }
          }
          break;
        case 'url':
        case 'cookie':
        case 'url_or_cookie':
          // Process standard handlers for value finding, persistence, and field updates.
          processHandler(config);
          break;
        default:
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
