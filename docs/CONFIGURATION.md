# Unified Parameter Handler Configuration Guide

This document explains how to configure the Unified Parameter Handler library.

## Overview

The core of the configuration lies in an array of handler objects. Each object defines how the library should find, process, and store a specific piece of data (like a URL parameter or a cookie) into a hidden input field on your web page.

The default configuration is exported from `src/config.js` as `defaultHandlerConfigs`. You can either use this default configuration directly or provide your own custom array when initializing the library.

## Configuration Object Properties

Each object in the configuration array defines a handler and can have the following properties:

*   **`id`**: (string, Required)
    *   A unique internal identifier for this handler (e.g., `'fbc'`, `'gclid'`, `'utm_source'`).
    *   Used primarily for logging and debugging purposes.
*   **`sourceType`**: (string, Required unless handled specially like `userAgent`)
    *   Specifies where the library should look for the value.
    *   Possible values:
        *   `'url'`: Look for the value in the URL query parameters only.
        *   `'cookie'`: Look for the value in the document's cookies only.
        *   `'url_or_cookie'`: Look in the URL query parameters first. If not found, look in the cookies.
        *   `'user_agent'`: Special type to read `navigator.userAgent`.
        *   `'ip_address'`: Special type to fetch the client's IP address from an external service (`https://checkip.amazonaws.com/`).
*   **`urlParamName`**: (string, Required if `sourceType` includes `'url'`)
    *   The exact name of the URL query parameter to search for (case-sensitive).
    *   Example: `'fbclid'`, `'utm_source'`.
*   **`cookieName`**: (string, Required if `sourceType` includes `'cookie'`)
    *   The exact name of the cookie to search for (case-sensitive).
    *   Example: `'_fbc'`, `'_fbp'`.
*   **`targetInputName`**: (string, Required)
    *   The `name` attribute of the target hidden input field where the found value should be placed.
    *   The library will look for an HTML input element like `<input type="hidden" name="yourTargetInputName">`.
    *   Example: `'custom FBC'`, `'custom UTM_SOURCE'`.
*   **`applyFormatting`**: (function, Optional)
    *   A JavaScript function to format or transform the raw value before it's set in the target input field.
    *   The function receives the raw value as its only argument and should return the formatted string.
    *   Example: A function to prepend a timestamp to a Facebook click ID.
*   **`setCookie`**: (object, Optional)
    *   Configuration for setting or updating a cookie when a value is found.
    *   **`enabledOnUrlHit`**: (boolean) If `true` and the value was sourced from a URL parameter (`sourceType` included `'url'`), a cookie will be set/updated. Defaults to `false`.
    *   **`cookieNameToSet`**: (string, Required if `setCookie` is defined) The name of the cookie to create or update. Can be the same as `cookieName` or different.
    *   **`daysToExpiry`**: (number, Required if `setCookie` is defined) The lifespan of the cookie in days.
    *   **`persist`**: (boolean, Optional)
        *   If `true`, the handler will save its value to `localStorage` when a "fresh" value is found in the URL.
        *   On subsequent page loads where the value is not found in the URL or a cookie, the handler will retrieve the value from `localStorage`.
        *   This is ideal for capturing attribution parameters (like UTMs) on a landing page and having them available on other pages (like a contact or checkout page) that the user navigates to later.
        *   Defaults to `false`.
*   **`retryMechanism`**: (object, Optional, only applies if `sourceType` includes `'cookie'`)
    *   Configuration for retrying the cookie read if the cookie is not found on the initial attempt. This is useful for cookies that might be set asynchronously by other scripts (like analytics platforms).
    *   **`enabled`**: (boolean) Set to `true` to enable the retry mechanism. Defaults to `false`.
    *   **`maxAttempts`**: (number, Required if `enabled` is true) The maximum number of times to retry reading the cookie.
    *   **`interval`**: (number, Required if `enabled` is true) The delay in milliseconds between retry attempts.
*   **`reporting`**: (object, Optional)
    *   Configuration for reporting the handler's status and results to third-party analytics platforms.
    *   **`msClarity`**: (boolean) If `true`, the library will report the status and final value for this handler to Microsoft Clarity using `clarity('set', key, value)`. Defaults to `false`.
*   **`monitorChanges`**: (boolean, Optional, applies only when `targetInputName` is specified)
    *   If `true` (the default), the library will attach a `MutationObserver` to the target input field after setting its value.
    *   If an external script subsequently changes the value of the input, the observer will detect this change and send a one-time report to MS Clarity with details about the overwrite.
    *   This is highly recommended to diagnose issues where other scripts (like from a CRM or an A/B testing platform) might be clearing or altering the attribution data you are trying to capture.
    *   Set to `false` to disable this behavior for a specific handler.

## Reporting to Microsoft Clarity

When `reporting: { msClarity: true }` is enabled for a handler, the library will send two custom tags to Microsoft Clarity:

1.  **Status Tag**: A tag indicating the outcome of the handler.
    *   **Key**: `uph_{handler.id}_status` (e.g., `uph_utm_source_status`)
    *   **Values**:
        *   `found_url`: Value was successfully found in the URL.
        *   `found_cookie`: Value was successfully found in a cookie.
        *   `found_storage`: Value was successfully retrieved from `localStorage`.
        *   `found_user_agent`: The user agent string was captured.
        *   `found_ip`: The client IP address was successfully fetched.
        *   `input_not_found`: The handler ran, but the target input field was not found on the page.
        *   `ignored_empty_url_param`: The URL parameter was present but had no value, so it was ignored.
        *   `ip_fetch_timed_out`: The request to fetch the client IP address timed out.
        *   `ip_fetch_failed`: The request to fetch the client IP address failed for a reason other than a timeout.

2.  **Value Tag**: A tag containing the final value that was processed.
    *   **Key**: `uph_{handler.id}_value` (e.g., `uph_utm_source_value`)
    *   **Value**: The actual value found (e.g., "google", "fb.1.123...", "127.0.0.1").

This allows you to create segments and custom reports in Microsoft Clarity based on the attribution data captured by this library.

## Default Configuration Explained

The library comes with a pre-defined set of handlers (`defaultHandlerConfigs`) covering common tracking parameters:

### Facebook Handlers

*   **`fbc`**:
    *   Looks for `fbclid` in the URL first, then the `_fbc` cookie.
    *   Applies specific formatting (`formatFbClickId` from `utils.js`).
    *   If `fbclid` is found in the URL, it sets/updates the `_fbc` cookie with a 90-day expiry.
    *   If reading the `_fbc` cookie initially fails, it retries up to 5 times with a 5-second interval.
    *   Targets an input named `custom FBC`.
*   **`fbp`**:
    *   Looks for the `_fbp` cookie only.
    *   If reading the `_fbp` cookie initially fails, it retries up to 5 times with a 5-second interval.
    *   Targets an input named `custom FBP`.

### Google Handlers

*   **`gclid`**, **`wbraid`**, **`gbraid`**:
    *   Look for their respective parameters (`gclid`, `wbraid`, `gbraid`) in the URL only.
    *   If found, set a corresponding cookie (`gclid`, `wbraid`, `gbraid`) with a 90-day expiry.
    *   Target inputs named `custom GCLID`, `custom WBRAID`, `custom GBRAID`.

### UTM Handlers

*   **`utm_source`**, **`utm_medium`**, **`utm_campaign`**, **`utm_term`**, **`utm_content`**, **`utm_id`**, **`utm_pub`**, **`utm_size`**, **`utm_broker`**:
    *   Look for their respective parameters in the URL only.
    *   Do not set any cookies.
    *   Target inputs named `custom UTM_SOURCE`, `custom UTM_MEDIUM`, etc.

### Browser/Client Info

*   **`userAgent`**:
    *   This is a special handler that uses `sourceType: 'user_agent'`.
    *   It directly reads the `navigator.userAgent` string.
    *   Targets an input named `userAgent`.
*   **`clientIp`**:
    *   This is a special handler that uses `sourceType: 'ip_address'`.
    *   It fetches the client's public IP address by calling `https://checkip.amazonaws.com/`.
    *   Targets an input named `clientIp`.

## How-To Examples

### Example 1: Basic Usage with Defaults

To use the library with all the default handlers:

1.  **Include the script:** Add the bundled script (e.g., `unified-param-handler.js`) to your HTML.
2.  **Add hidden fields:** Ensure your HTML form contains hidden input fields with `name` attributes matching the `targetInputName` values in the default configuration (e.g., `<input type="hidden" name="custom FBC">`, `<input type="hidden" name="custom GCLID">`, `<input type="hidden" name="custom UTM_SOURCE">`, etc.).
3.  **Initialize:** Call the main function, which is exposed globally as `window.UnifiedParamHandler.init` (see `main.js`).

```html
<!-- In your HTML -->
<form>
  <!-- ... other form fields ... -->
  <input type="hidden" name="custom FBC">
  <input type="hidden" name="custom FBP">
  <input type="hidden" name="custom GCLID">
  <input type="hidden" name="custom WBRAID">
  <input type="hidden" name="custom GBRAID">
  <input type="hidden" name="custom UTM_SOURCE">
  <input type="hidden" name="custom UTM_MEDIUM">
  <input type="hidden" name="custom UTM_CAMPAIGN">
  <!-- ... add inputs for other default handlers ... -->
  <input type="hidden" name="userAgent">
  <input type="hidden" name="clientIp">
</form>

<script src="path/to/unified-param-handler.js"></script>
<script>
  // This will use the defaultHandlerConfigs internally
  window.UnifiedParamHandler.init();
</script>
```

### Example 2: Using Custom Configuration

If you only need specific handlers or different settings:

1.  **Define your config:** Create a custom array of handler objects.
2.  **Pass it during initialization:** Provide your custom array to the initialization function.

```javascript
// my-custom-config.js
const myCustomHandlers = [
  // Only handle gclid and utm_source
  {
    id: 'gclid',
    sourceType: 'url',
    urlParamName: 'gclid',
    targetInputName: 'google_click_id', // Use a different input name
    setCookie: {
      enabledOnUrlHit: true,
      cookieNameToSet: 'my_gclid_cookie', // Use a different cookie name
      daysToExpiry: 30, // Shorter expiry
    },
  },
  {
    id: 'utm_source',
    sourceType: 'url',
    urlParamName: 'utm_source',
    targetInputName: 'source_tracker',
  },
  // Add a custom parameter from a cookie
  {
    id: 'affiliate_id',
    sourceType: 'cookie',
    cookieName: 'aff_ref',
    targetInputName: 'affiliate_code',
    retryMechanism: { // Retry if cookie isn't immediately available
      enabled: true,
      maxAttempts: 3,
      interval: 1000,
    },
  }
];

// In your HTML script tag
// Pass your custom config array to the init function
window.UnifiedParamHandler.init(myCustomHandlers);

```

```html
<!-- Corresponding HTML for custom config -->
<form>
  <!-- ... other form fields ... -->
  <input type="hidden" name="google_click_id">
  <input type="hidden" name="source_tracker">
  <input type="hidden" name="affiliate_code">
</form>

<script src="path/to/unified-param-handler.js"></script>
<script src="path/to/my-custom-config.js"></script>
<script>
  window.UnifiedParamHandler.init(myCustomHandlers);
</script>
```

### Example 3: Adding Custom Formatting

Let's say you want to capture `utm_campaign` but prefix it with the current date.

```javascript
// Function to add date prefix
function addDatePrefix(rawValue) {
  if (!rawValue) return ''; // Handle empty values
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${dateString}_${rawValue}`;
}

const myHandlersWithFormatting = [
  {
    id: 'utm_campaign_dated',
    sourceType: 'url',
    urlParamName: 'utm_campaign',
    targetInputName: 'dated_campaign', // Target input name
    applyFormatting: addDatePrefix, // Apply the custom function
  },
  // ... other handlers
];

// Initialize with this config
window.UnifiedParamHandler.init(myHandlersWithFormatting);
```

```html
<!-- Corresponding HTML -->
<form>
  <!-- ... other form fields ... -->
  <input type="hidden" name="dated_campaign">
</form>
```

This guide provides a comprehensive overview of the configuration options available in the Unified Parameter Handler library. Remember to adjust `targetInputName` values and initialization calls according to your specific project setup and the actual export names from `main.js`.
