// src/engine.js
import * as utils from './utils.js';
import { defaultHandlerConfigs } from './config.js';

/**
 * @typedef {import('./config.js').HandlerConfig} HandlerConfig
 */

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
 * It attempts to find the specified value from the configured source (URL or cookie),
 * applies formatting if necessary, updates the target input field, sets a cookie if configured,
 * and initiates the retry mechanism if the value is not found initially but retry is enabled.
 *
 * @param {HandlerConfig} config - A single handler configuration object.
 * @param {HTMLInputElement} inputElement - The corresponding target input DOM element.
 */
function processHandler(config, inputElement) {
  utils.startGroup(`Processing Handler: ${config.id}`, true);

  if (!inputElement) {
    utils.logError(
      `Target input field '${config.targetInputName}' for handler '${config.id}' not found. Skipping.`
    );
    utils.endGroup();
    return; // Cannot proceed without the target input
  }

  let rawValue = null;
  let valueSource = null; // 'url' or 'cookie'

  // 1. Check URL Source
  if (config.sourceType.includes('url') && config.urlParamName) {
    rawValue = utils.URL_PARAMS.get(config.urlParamName);
    if (rawValue !== null) {
      valueSource = 'url';
      utils.logDebug(
        `Found raw value for '${config.id}' in URL ('${config.urlParamName}'):`,
        rawValue
      );
    }
  }

  // 2. Check Cookie Source (if not found in URL or if source is only cookie)
  if (
    rawValue === null &&
    config.sourceType.includes('cookie') &&
    config.cookieName
  ) {
    rawValue = utils.getCookie(config.cookieName); // Gets fresh cookies
    if (rawValue !== null) {
      valueSource = 'cookie';
      utils.logDebug(
        `Found raw value for '${config.id}' in Cookie ('${config.cookieName}'):`,
        rawValue
      );
    }
  }

  // 3. Process Found Value (or handle not found)
  if (rawValue !== null) {
    let finalValue = rawValue; // Initialize finalValue with the raw value

    // 3a. Apply Formatting ONLY if source was URL and formatter exists
    if (valueSource === 'url' && typeof config.applyFormatting === 'function') {
      utils.logDebug(
        `Attempting formatting for '${config.id}' as source was URL.`
      );
      try {
        const formatted = config.applyFormatting(rawValue);
        if (formatted !== null && formatted !== undefined) {
          // *** IMPORTANT: Assign formatted value to finalValue ONLY here ***
          finalValue = formatted;
          utils.logDebug(`Formatted value for '${config.id}':`, finalValue);
        } else {
          utils.logDebug(
            `Formatting function for '${config.id}' returned null/undefined. Using raw value.`
          );
          // finalValue already holds rawValue, so no action needed
        }
      } catch (formatError) {
        utils.logError(
          `Error applying formatting function for handler '${config.id}': ${formatError.message}. Using raw value.`
        );
        // finalValue already holds rawValue
      }
    } // If valueSource was 'cookie', finalValue remains the rawValue

    // 3b. Update Input Field
    inputElement.value = finalValue; // Use the correctly determined finalValue
    utils.logDebug(
      `Input field '${config.targetInputName}' updated for '${config.id}'. Value Source: ${valueSource}. Final Value:`,
      finalValue
    );

    // 3c. Set Cookie (Only if source was URL)
    if (
      valueSource === 'url' &&
      config.setCookie &&
      config.setCookie.enabledOnUrlHit
    ) {
      utils.setCookie(
        config.setCookie.cookieNameToSet,
        finalValue, // Use the potentially formatted value from URL hit
        config.setCookie.daysToExpiry
      );
    }
  } else {
    // 4. Value Not Found - Initiate Retry or Clear Input
    utils.logDebug(
      `No initial value found for '${config.id}' from configured sources (${config.sourceType}).`
    );

    // *** Clear the input field *before* deciding whether to retry ***
    // This ensures the input is empty if the value isn't found immediately.
    if (inputElement.value !== '') {
      inputElement.value = '';
      utils.logDebug(
        `Cleared input field '${config.targetInputName}' for '${config.id}' as value not found initially.`
      );
    } else {
      utils.logDebug(
        `Input field '${config.targetInputName}' for '${config.id}' was already empty.`
      );
    }

    if (
      config.sourceType.includes('cookie') &&
      config.retryMechanism &&
      config.retryMechanism.enabled
    ) {
      // Initiate retry only if cookie was a potential source and retry is enabled
      waitForCookieAndUpdateInput(
        config.cookieName,
        inputElement,
        config.retryMechanism,
        1 // Start counting attempts from 1 for retry
      );
    }
    // No need for an 'else' here to clear the input again, it was done above.
  }

  utils.endGroup(); // End processing group for this handler
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
 * Selects the configuration (default or custom), finds target input fields,
 * and processes each handler configuration.
 * Handles special cases like 'userAgent' and 'ip_address' directly.
 *
 * @param {HandlerConfig[]} [customConfigs] - Optional array of custom handler configurations. If not provided or invalid, uses `defaultHandlerConfigs`.
 */
export function init(customConfigs) {
  utils.startGroup('Initializing Unified Parameter Handler');
  const configsToUse =
    Array.isArray(customConfigs) && customConfigs.length > 0
      ? customConfigs
      : defaultHandlerConfigs;

  utils.logDebug('Using configurations:', configsToUse);

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
      !config.sourceType || // sourceType is now required for all standard types
      !config.targetInputName
    ) {
      // Allow specific validation bypass only for known special types if needed
      // but generally enforce structure
      utils.logError(
        `Invalid or incomplete handler config: ${JSON.stringify(
          config
        )}. Skipping.`
      );
      return;
    }

    const inputElement = document.querySelector(
      `input[name="${config.targetInputName}"]`
    );
    if (!inputElement) {
      utils.logError(
        `Target input '${config.targetInputName}' for '${config.id}' not found. Skipping.`
      );
      return;
    }

    try {
      switch (config.sourceType) {
        case 'user_agent':
          if (typeof navigator !== 'undefined' && navigator.userAgent) {
            // Explicitly get the value before assigning
            const userAgentValue = navigator.userAgent;
            inputElement.value = userAgentValue;
            utils.logDebug(
              `Input field '${config.targetInputName}' updated with User Agent.`
            );
          } else {
            utils.logError(
              'Cannot retrieve User Agent: navigator.userAgent is not available.'
            );
          }
          break;
        case 'ip_address':
          fetchClientIpAndUpdateInput(inputElement, config.targetInputName);
          break;
        case 'url':
        case 'cookie':
        case 'url_or_cookie':
          // Process standard handlers
          processHandler(config, inputElement);
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
      console.error(error); // Log full stack trace
    }
  });

  utils.logDebug('Finished processing configurations.');
  utils.endGroup();
}
