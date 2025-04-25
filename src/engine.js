// src/engine.js
import * as utils from './utils.js';
import { defaultHandlerConfigs } from './config.js';

/**
 * Waits for a specific cookie and updates the input field if found.
 * This is called ONLY when the initial check fails and retry is enabled.
 *
 * @param {string} cookieName Name of the cookie to wait for.
 * @param {HTMLElement} inputElement The actual DOM element of the target input.
 * @param {object} retryConfig The retryMechanism part of the handler config.
 * @param {number} initialAttemptCount The starting attempt number (usually 1).
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
            `Cookie ${cookieName} still not found. Will retry again in ${interval / 1000
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
 * Processes a single configuration object from the handlerConfigs array.
 * Finds values from URL/cookie, formats, updates input, sets cookies, and initiates retry if needed.
 * @param {object} config A single configuration object from `handlerConfigs`.
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
            utils.logDebug(`Attempting formatting for '${config.id}' as source was URL.`);
            try {
                const formatted = config.applyFormatting(rawValue);
                if (formatted !== null && formatted !== undefined) {
                    // *** IMPORTANT: Assign formatted value to finalValue ONLY here ***
                    finalValue = formatted;
                    utils.logDebug(`Formatted value for '${config.id}':`, finalValue);
                } else {
                    utils.logDebug(`Formatting function for '${config.id}' returned null/undefined. Using raw value.`);
                    // finalValue already holds rawValue, so no action needed
                }
            } catch (formatError) {
                logError(`Error applying formatting function for handler '${config.id}': ${formatError.message}. Using raw value.`);
                // finalValue already holds rawValue
            }
        } // If valueSource was 'cookie', finalValue remains the rawValue

        // 3b. Update Input Field
        inputElement.value = finalValue; // Use the correctly determined finalValue
        utils.logDebug(`Input field '${config.targetInputName}' updated for '${config.id}'. Value Source: ${valueSource}. Final Value:`, finalValue);

        // 3c. Set Cookie (Only if source was URL)
        if (valueSource === 'url' && config.setCookie && config.setCookie.enabledOnUrlHit) {
            utils.setCookie(
                config.setCookie.cookieNameToSet,
                finalValue, // Use the potentially formatted value from URL hit
                config.setCookie.daysToExpiry
            );
        }
    } else {
        // 4. Value Not Found - Initiate Retry or Clear Input
        utils.logDebug(`No initial value found for '${config.id}' from configured sources (${config.sourceType}).`);

        // *** Clear the input field *before* deciding whether to retry ***
        // This ensures the input is empty if the value isn't found immediately.
        if (inputElement.value !== '') {
            inputElement.value = '';
            utils.logDebug(`Cleared input field '${config.targetInputName}' for '${config.id}' as value not found initially.`);
        } else {
            utils.logDebug(`Input field '${config.targetInputName}' for '${config.id}' was already empty.`);
        }


        if (config.sourceType.includes('cookie') && config.retryMechanism && config.retryMechanism.enabled) {
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

// Define the main initialization function
export function init(customConfigs) {
    utils.startGroup('Initializing Unified Parameter Handler');
    const configsToUse =
        Array.isArray(customConfigs) && customConfigs.length > 0
            ? customConfigs
            : defaultHandlerConfigs; // Use custom config if valid, else default

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
            // *** Allow missing sourceType for userAgent ***
            (!config.sourceType && config.id !== 'userAgent') || 
            !config.targetInputName
        ) {
            utils.logError(`Invalid handler config: ${JSON.stringify(config)}`);
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
            // *** Handle userAgent specifically ***
            if (config.id === 'userAgent') {
                if (typeof navigator !== 'undefined' && navigator.userAgent) {
                    inputElement.value = navigator.userAgent;
                    utils.logDebug(`Input field '${config.targetInputName}' updated with User Agent.`);
                } else {
                    utils.logError('Cannot retrieve User Agent: navigator.userAgent is not available.');
                }
            } else {
                // *** Process standard handlers ***
                processHandler(config, inputElement); // Pass element
            }
        } catch (error) {
            utils.logError(
                `Unexpected error processing handler '${config.id}': ${error.message}`
            );
            console.error(error); // Log full stack trace for unexpected errors
        }
    });

    utils.logDebug('Finished processing configurations.');
    utils.endGroup();
}
