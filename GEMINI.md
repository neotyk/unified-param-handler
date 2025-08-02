# GEMINI.md

## Project Overview

This project, "unified-param-handler," is a JavaScript library designed to capture, store, and manage URL parameters (like UTM, gclid, fbclid) and cookies. It persists these values in `localStorage` and populates hidden form fields to ensure tracking data is submitted with forms. The library is written in ES6, uses Webpack for bundling, Babel for transpilation, and Jest for testing.

## Building and Running

### Dependencies

*   Node.js and yarn

### Key Commands

*   **Installation:**
    ```bash
    yarn install
    ```

*   **Building for Production:**
    ```bash
    yarn build
    ```
    This creates a minified production-ready file in the `dist/` directory. There are also specialized build commands available in `package.json` to create builds with specific configurations.

*   **Building for Development:**
    ```bash
    yarn build:dev
    ```
    This creates a development build with source maps.

*   **Running Tests:**
    ```bash
    yarn test
    ```

*   **Linting:**
    ```bash
    yarn lint
    ```

## Development Conventions

*   **Code Style:** The project uses Prettier for code formatting and ESLint for linting. The configuration for these tools can be found in `package.json` and `.eslintrc.js`.
*   **Commits:** The project uses `standard-version` for versioning and changelog generation, which implies a conventional commit message format.
*   **Modularity:** The code is organized into modules within the `src/` directory, with `main.js` as the entry point, `engine.js` containing the core logic, and `config.js` for configuration.
*   **Configuration:** The library is highly configurable. A default configuration is provided, but it can be overridden at build time or runtime.
