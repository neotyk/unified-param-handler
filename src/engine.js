// src/engine.js
import * as utils from './utils.js';
// defaultHandlerConfigs will be from src/config.js or src/dummy-config.js based on build
import { defaultHandlerConfigs } from './config.js';
import { formatFbClickId } from './utils.js';
import { reportToClarity } from './reporting.js';

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
  element,
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
      element.value = cookieValue;
      utils.logDebug(
        `Element '[name="${element.name}"]' updated from RETRIED cookie '${cookieName}':`,
        cookieValue
      );
      utils.endGroup();
      return;
    }

    attempts++;
    if (attempts > maxAttempts) {
      utils.logError(
        `Failed to find ${cookieName} cookie after ${maxAttempts} total attempts. Element '[name="${element.name}"]' might remain empty or unchanged.`
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
 * Extracts a value from the configured source (URL or cookie).
 * @param {HandlerConfig} config - The handler configuration.
 * @returns {{value: string|null, source: string|null}} The found value and its source.
 */
function extractValueFromSource(config) {
  let value = null;
  let source = null;

  if (config.sourceType.includes('url') && config.urlParamName) {
    const urlVal = utils.getUrlParams().get(config.urlParamName);
    if (urlVal) {
      value = urlVal;
      source = 'url';
    } else if (urlVal === '') {
      utils.logDebug(
        `Ignoring empty value from URL param '${config.urlParamName}'.`
      );
      if (config.reporting && config.reporting.msClarity) {
        reportToClarity(`uph_${config.id}_status`, 'ignored_empty_url_param');
      }
    }
  }

  if (
    value === null &&
    config.sourceType.includes('cookie') &&
    config.cookieName
  ) {
    const cookieVal = utils.getCookie(config.cookieName);
    if (cookieVal) {
      value = cookieVal;
      source = 'cookie';
    }
  }

  return { value, source };
}

/**
 * Applies formatting, persists the value to localStorage, and sets a cookie.
 * This is only done for values freshly found from the URL.
 * @param {string} value - The value to process.
 * @param {HandlerConfig} config - The handler configuration.
 * @returns {string} The processed (potentially formatted) value.
 */
function applyFormattingAndPersistence(value, config) {
  utils.logDebug(`Found fresh value for '${config.id}' from URL:`, value);
  let valueToPersist = value;

  let formatterFunction = null;
  if (typeof config.applyFormatting === 'function') {
    formatterFunction = config.applyFormatting;
  } else if (typeof config.applyFormatting === 'string') {
    formatterFunction = knownFormatters[config.applyFormatting];
  }

  if (formatterFunction) {
    try {
      const formatted = formatterFunction(value);
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

  if (config.persist) {
    utils.saveToPersistentStorage(config.id, valueToPersist);
  }
  if (config.setCookie && config.setCookie.enabledOnUrlHit) {
    utils.setCookie(
      config.setCookie.cookieNameToSet,
      valueToPersist,
      config.setCookie.daysToExpiry
    );
  }

  if (config.reporting && config.reporting.msClarity) {
    reportToClarity(`uph_${config.id}_status`, 'found_url');
    reportToClarity(`uph_${config.id}_value`, valueToPersist);
  }

  return valueToPersist;
}

/**
 * Determines the final value to be used, checking persisted storage if no fresh value was found.
 * @param {string|null} freshValue - The value from URL/cookie, or null.
 * @param {string|null} valueSource - The source of the fresh value.
 * @param {HandlerConfig} config - The handler configuration.
 * @returns {{finalValue: string|null, finalSource: string|null}} The definitive value and its source.
 */
function determineFinalValue(freshValue, valueSource, config) {
  if (freshValue !== null) {
    return { finalValue: freshValue, finalSource: valueSource };
  }

  if (config.persist) {
    const persistedValue = utils.getFromPersistentStorage(config.id);
    if (persistedValue) {
      utils.logDebug(
        `Using persisted value for '${config.id}':`,
        persistedValue
      );
      if (config.reporting && config.reporting.msClarity) {
        reportToClarity(`uph_${config.id}_status`, 'found_storage');
        reportToClarity(`uph_${config.id}_value`, persistedValue);
      }
      return { finalValue: persistedValue, finalSource: 'storage' };
    }
  }

  return { finalValue: null, finalSource: valueSource };
}

/**
 * Updates the DOM element with the final value and sets up MutationObserver.
 * @param {HTMLInputElement|HTMLTextAreaElement} element - The DOM element to update.
 * @param {string|null} finalValue - The value to set.
 * @param {string|null} finalSource - The source of the value.
 * @param {HandlerConfig} config - The handler configuration.
 */
function updateInputElement(element, finalValue, finalSource, config) {
  if (finalValue !== null) {
    element.value = finalValue;
    utils.logDebug(
      `Element '[name="${config.targetInputName}"]' updated. Source: ${
        finalSource || 'none'
      }.`
    );

    if (config.monitorChanges !== false) {
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'value'
          ) {
            const newValue = element.value;
            if (newValue !== finalValue) {
              utils.logDebug(
                `Value of input [name="${config.targetInputName}"] was changed externally from '${finalValue}' to '${newValue}'. Reporting.`
              );
              if (config.reporting && config.reporting.msClarity) {
                reportToClarity(`uph_${config.id}_overwritten`, 'true');
                reportToClarity(`uph_${config.id}_original_value`, finalValue);
                reportToClarity(`uph_${config.id}_new_value`, newValue);
              }
              observer.disconnect();
            }
          }
        }
      });
      observer.observe(element, { attributes: true });
      utils.logDebug(
        `Attached MutationObserver to [name="${config.targetInputName}"].`
      );
    }
  } else {
    element.value = '';
    utils.logDebug(
      `No value found for '${config.id}', cleared element '[name="${config.targetInputName}"]'.`
    );
    if (config.reporting && config.reporting.msClarity) {
      reportToClarity(`uph_${config.id}_status`, 'cleared_input');
    }
  }

  if (
    finalValue === null &&
    config.sourceType.includes('cookie') &&
    config.retryMechanism &&
    config.retryMechanism.enabled
  ) {
    waitForCookieAndUpdateInput(
      config.cookieName,
      element,
      config.retryMechanism
    );
  }
}

/**
 * Processes a single handler configuration.
 * @param {HandlerConfig} config - A single handler configuration object.
 */
function processHandler(config) {
  utils.startGroup(`Processing Handler: ${config.id}`, true);

  // 1. Find a fresh value from URL or Cookie
  let { value: freshValue, source: valueSource } =
    extractValueFromSource(config);

  // 2. If found from URL, format and persist it
  if (valueSource === 'url') {
    freshValue = applyFormattingAndPersistence(freshValue, config);
  } else if (valueSource === 'cookie') {
    utils.logDebug(
      `Found fresh value for '${config.id}' from Cookie:`,
      freshValue
    );
    if (config.reporting && config.reporting.msClarity) {
      reportToClarity(`uph_${config.id}_status`, 'found_cookie');
      reportToClarity(`uph_${config.id}_value`, freshValue);
    }
  }

  // 3. Determine the final value, checking storage if necessary
  const { finalValue, finalSource } = determineFinalValue(
    freshValue,
    valueSource,
    config
  );

  // 4. Update Input Field(s) if they exist
  if (config.targetInputName) {
    const targetElements = document.querySelectorAll(
      `input[name="${config.targetInputName}"], textarea[name="${config.targetInputName}"]`
    );

    if (targetElements.length > 0) {
      targetElements.forEach((element) => {
        updateInputElement(element, finalValue, finalSource, config);
      });
    } else {
      utils.logDebug(
        `No elements found with name '${config.targetInputName}' on this page.`
      );
      if (config.reporting && config.reporting.msClarity) {
        reportToClarity(`uph_${config.id}_status`, 'input_not_found');
      }
    }
  } else if (finalValue === null) {
    utils.logDebug(
      `No value found for '${config.id}' and no targetInputName specified.`
    );
    if (config.reporting && config.reporting.msClarity) {
      reportToClarity(`uph_${config.id}_status`, 'not_found');
    }
  }

  utils.endGroup();
}

/**
 * Fetches the client's IP address from an external service and updates the target element.
 * Includes a timeout to prevent race conditions.
 * @private
 * @param {HTMLInputElement|HTMLTextAreaElement} element - The element to update with the IP address.
 * @param {string} targetInputName - The name attribute of the element (for logging).
 * @param {HandlerConfig} config - The handler configuration object.
 */
function fetchClientIpAndUpdateInput(element, targetInputName, config) {
  utils.logDebug(
    `Fetching Client IP for element '[name="${targetInputName}"]'...`
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  return fetch('https://checkip.amazonaws.com/', { signal: controller.signal })
    .then((res) => {
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then((ip) => {
      const trimmedIp = ip.trim();
      element.value = trimmedIp;
      utils.logDebug(
        `Element '[name="${targetInputName}"]' updated with Client IP:`,
        trimmedIp
      );
      if (config.reporting && config.reporting.msClarity) {
        reportToClarity(`uph_${config.id}_status`, 'found_ip');
        reportToClarity(`uph_${config.id}_value`, trimmedIp);
      }
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      let errorMessage;
      if (error.name === 'AbortError') {
        errorMessage = 'IP_FETCH_TIMED_OUT';
        utils.logError(`IP fetch for '[name="${targetInputName}"]' timed out.`);
        if (config.reporting && config.reporting.msClarity) {
          reportToClarity(`uph_${config.id}_status`, 'ip_fetch_timed_out');
        }
      } else {
        errorMessage = 'IP_FETCH_FAILED';
        utils.logError(
          `Failed to fetch Client IP for '[name="${targetInputName}"]': ${error.message}`
        );
        if (config.reporting && config.reporting.msClarity) {
          reportToClarity(`uph_${config.id}_status`, 'ip_fetch_failed');
        }
      }
      element.value = errorMessage;
    });
}

/**
 * Initializes the Unified Parameter Handler.
 */
export function init(customConfigs) {
  // customConfigs argument is from runtime
  utils.startGroup('Initializing Unified Parameter Handler');

  // --- Configuration Loading (No changes needed) ---
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

  // --- Handler Processing Loop ---
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
          return;
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
              if (config.reporting && config.reporting.msClarity) {
                reportToClarity(`uph_${config.id}_status`, 'found_user_agent');
                reportToClarity(`uph_${config.id}_value`, navigator.userAgent);
              }
            } else {
              element.value = 'USER_AGENT_NOT_FOUND';
              utils.logError(
                `navigator.userAgent not available for element '[name="${config.targetInputName}"]'.`
              );
              if (config.reporting && config.reporting.msClarity) {
                reportToClarity(
                  `uph_${config.id}_status`,
                  'user_agent_not_found'
                );
              }
            }
          } else if (config.sourceType === 'ip_address') {
            fetchClientIpAndUpdateInput(
              element,
              config.targetInputName,
              config
            ).catch((_error) => {
              // The error is already logged inside the function, so we just need to catch the rejection.
            });
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
      if (config.reporting && config.reporting.msClarity) {
        reportToClarity(`uph_${config.id}_status`, 'error');
        reportToClarity(`uph_${config.id}_error`, error.message);
      }
      console.error(error);
    }
  });

  utils.logDebug('Finished processing configurations.');
  utils.endGroup();
}
