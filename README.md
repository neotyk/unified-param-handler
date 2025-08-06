# Unified Parameter Handler

Handles URL parameters (like UTM, gclid, fbclid) and cookies, reading their values and storing them into designated hidden input fields within your web forms.

This library helps ensure that tracking parameters captured on landing pages are correctly passed along with form submissions.

## Features

*   Reads specified URL query parameters.
*   Reads specified browser cookies.
*   **Persists values** (like UTMs) in `localStorage` to retain them across page navigations.
*   Supports looking in URL first, then falling back to cookies, then to persisted storage.
*   Sets/updates cookies based on found URL parameters (configurable expiry).
*   Populates hidden HTML input fields with the found values.
*   Handles asynchronous cookie setting with configurable retries.
*   Supports custom formatting functions for values before storage.
*   Captures User Agent and Client IP address.
*   Comes with default configurations for common parameters (fbclid, fbp, gclid, wbraid, gbraid, UTMs, User Agent, Client IP).
*   Allows complete configuration customization.

## Quick Start

To quickly get the library working and capture common parameters like `utm_source` and `gclid`:

1.  **Include the script:** Add the bundled script (`unified-param-handler.js`) to your HTML page, preferably before the closing `</body>` tag.

    ```html
    <script src="path/to/dist/unified-param-handler.js"></script>
    ```

2.  **Add hidden input fields:** Place hidden input fields in your HTML form. The `name` attribute of these inputs must match the `targetInputName` defined in the library's configuration (by default, `custom UTM_SOURCE` for `utm_source` and `custom GCLID` for `gclid`).

    ```html
    <form action="/submit" method="post">
      <!-- Your other form fields -->
      <input type="hidden" name="custom UTM_SOURCE">
      <input type="hidden" name="custom GCLID">
      <button type="submit">Submit</button>
    </form>
    ```

3.  **Initialize the library:** Call the `init()` function once the DOM is ready. This will process the URL parameters and populate your hidden fields.

    ```html
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        window.UnifiedParamHandler.init();
      });
    </script>
    ```

Now, if a user lands on your page with a URL like `https://yourdomain.com/?utm_source=google&gclid=test_gclid_123`,
the hidden input fields will be automatically populated:

```html
<input type="hidden" name="custom UTM_SOURCE" value="google">
<input type="hidden" name="custom GCLID" value="test_gclid_123">
```

This data will then be submitted with your form.


## Installation

1.  **Get the code:**
    *   Clone the repository or download the `unified-handler-dist.zip` file from the [GitHub Releases](https://github.com/atomicagility/unified-param-handler/releases) page. This zip file contains the built library (`dist/`), the README, and the license.
    *   Alternatively, if using npm/yarn, you can potentially install it as a package (if published).

2.  **Build the project (if cloning):**
    If you cloned the repository, run the build command specified in `package.json` (e.g., `npm run build` or `yarn build`). This will generate the distributable file (e.g., `dist/unified-handler.min.js`).

    ```bash
    # Using npm
    npm install
    npm run build

    # Using yarn
    yarn install
    yarn build
    ```

2.  **Include the script:**
    Add the generated script file to your HTML page, preferably before the closing `</body>` tag.

    ```html
    <script src="path/to/dist/unified-handler.js"></script>
    ```

## Basic Usage

1.  **Add Hidden Fields:** Ensure your HTML form includes hidden input fields with `name` attributes matching the `targetInputName` specified in your configuration (either default or custom).

    ```html
    <form action="/submit" method="post">
      <!-- Other form fields -->
      <input type="hidden" name="custom FBC">
      <input type="hidden" name="custom FBP">
      <input type="hidden" name="custom GCLID">
      <input type="hidden" name="custom UTM_SOURCE">
      <!-- Add other necessary hidden fields -->
      <input type="hidden" name="userAgent"> 
      <input type="hidden" name="clientIp">

      <button type="submit">Submit</button>
    </form>
    ```

2.  **Initialize the Handler:** Call the initialization function. If you want to use the default configuration, call it without arguments. To use a custom configuration, pass your configuration array.

    ```html
    <script src="path/to/dist/unified-handler.js"></script>
    <script>
      // Initialize with default settings
      window.UnifiedParamHandler.init();

      // Or, initialize with custom settings (assuming myCustomHandlers is defined)
      // const myCustomHandlers = [ /* ... your config ... */ ];
      // window.UnifiedParamHandler.init(myCustomHandlers);
    </script>
    ```

## How It Works

The Unified Parameter Handler operates through a clear, sequential flow:

1.  **Initialization**: When `window.UnifiedParamHandler.init()` is called (typically on `DOMContentLoaded`),
    the library resolves its configuration. This can be the default set of handlers or a custom configuration provided by you.

2.  **Handler Iteration**: The library then iterates through each defined handler in the resolved configuration.
    Each handler specifies how to capture a particular piece of data (e.g., `utm_source`, `gclid`).

3.  **Value Extraction**: For each handler, the library attempts to extract a value from its configured source:
    *   **URL Parameters**: It first checks the current page's URL for the specified parameter.
    *   **Cookies**: If the value is not found in the URL (or if the handler is configured to only check cookies), it then looks for the value in the browser's cookies.
    *   **Local Storage (Persistence)**: If a value was previously captured from the URL and the handler is configured for `persist: true`, the library will save this value to `localStorage`. On subsequent page loads, if the value isn't found in the URL or cookies, it will retrieve it from `localStorage`.
    *   **Special Sources**: For `SourceType.USER_AGENT` or `SourceType.IP_ADDRESS`, it directly reads the user agent string or fetches the client's IP from an external service, respectively.

4.  **Value Processing**: Once a value is found, it undergoes further processing:
    *   **Formatting**: If an `applyFormatting` function is specified, the raw value is transformed (e.g., prepending a date, cleaning up a string).
    *   **Cookie Setting**: If the value was found in the URL and `setCookie.enabledOnUrlHit` is `true`, a corresponding cookie is set or updated in the browser.

5.  **Input Field Population**: Finally, the processed value is used to populate the `value` attribute of the hidden HTML input field(s) specified by the handler's `targetInputName`. If no value is found, the input field is typically cleared.

6.  **Change Monitoring (Optional)**: For handlers with `monitorChanges: true`, a `MutationObserver` is attached to the target input field. This observer detects if any other JavaScript on the page subsequently modifies the input's value, which can be useful for debugging conflicts with other scripts.

This systematic approach ensures that tracking data is reliably captured, persisted, and made available for form submissions.

## Configuration

For detailed configuration options, default settings, and advanced examples, please see the [Configuration Guide](./docs/CONFIGURATION.md).

## Development

*   Install dependencies: `npm install` or `yarn install`
*   Build for production: `npm run build` or `yarn build`
*   Build for development: `npm run build:dev` or `yarn build:dev`
*   Watch for changes: `npm run watch` or `yarn watch`
*   Run tests: `npm test` or `yarn test`
*   Lint code: `npm run lint` or `yarn lint`
*   Format code: `npm run format` or `yarn format`

## License

This project is licensed under the GNU General Public License v3.0 or later. See the [COPYING](./COPYING) file for details.
