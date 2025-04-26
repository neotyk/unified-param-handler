# Unified Parameter Handler

Handles URL parameters (like UTM, gclid, fbclid) and cookies, reading their values and storing them into designated hidden input fields within your web forms.

This library helps ensure that tracking parameters captured on landing pages are correctly passed along with form submissions.

## Features

*   Reads specified URL query parameters.
*   Reads specified browser cookies.
*   Supports looking in URL first, then falling back to cookies.
*   Sets/updates cookies based on found URL parameters (configurable expiry).
*   Populates hidden HTML input fields with the found values.
*   Handles asynchronous cookie setting with configurable retries.
*   Supports custom formatting functions for values before storage.
*   Captures User Agent and Client IP address.
*   Comes with default configurations for common parameters (fbclid, fbp, gclid, wbraid, gbraid, UTMs, User Agent, Client IP).
*   Allows complete configuration customization.

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

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. See the [LICENSE](./LICENSE) file for details.
