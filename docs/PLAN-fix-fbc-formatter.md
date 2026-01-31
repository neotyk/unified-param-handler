# Fix: FBC Formatter + Cookie Overwrite Logic

**Status: ✅ IMPLEMENTED**

## Problem 1: Formatter Not Applied

The DaVinci Signal Health Report shows that **88% of fbc values are being stored as raw `fbclid`** (e.g., `PAZXh0bgNhZW0...`) instead of the properly formatted `fb.1.{timestamp}.{fbclid}` format. This means the `formatFbClickId` formatter is not being applied.

## Problem 2: Cookie Overwrite in In-App Browser

When `fbclid` is in the URL, we were always overwriting the `_fbc` cookie - even if Meta's pixel (`events.js`) has already set a properly formatted one. In In-App browser scenarios, this loses the valid cookie set by Meta.

**Desired behavior**: If `_fbc` cookie already exists (set by Meta), use that value instead of overwriting. Update localStorage with the cookie value so forms use the correct `_fbc`.

## Root Cause

**Found in `webpack.config.js:58`:**

```javascript
WEBPACK_CUSTOM_CONFIGS: JSON.stringify(customConfigsContent),
```

Custom configs like `davinci-config.js` import and use the formatter as a **function reference**:

```javascript
import { formatFbClickId } from './src/utils.js';
// ...
applyFormatting: formatFbClickId,  // Function reference
```

When webpack builds the custom config:
1. `require(resolvedPath)` loads the config with the real function
2. `JSON.stringify()` is called to inject it via DefinePlugin
3. **Functions cannot be JSON serialized** - they become `undefined` or are omitted

Result: The `applyFormatting` property is lost/undefined in the built output, and the formatter is never applied.

---

## TDD Implementation Sequence

Following Red-Green-Refactor:

### Step 1: Write Tests (RED)

Add tests that will FAIL with current code, proving they can catch the bug.

**File:** `tests/engine.test.js`

```javascript
test('logs error when unknown string formatter is specified', () => {
  const configWithUnknownFormatter = {
    id: 'test_handler',
    sourceType: SourceType.URL,
    urlParamName: 'test_param',
    targetInputName: 'test-input',
    applyFormatting: 'nonExistentFormatter',  // Unknown formatter
  };

  const input = addHiddenInput('test-input');
  setUrlParams('?test_param=test_value');

  init([configWithUnknownFormatter]);

  // Should log error about unknown formatter
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining("Unknown formatter 'nonExistentFormatter'")
  );
  // Value should still be set (unformatted) as fallback
  expect(input.value).toBe('test_value');
});
```

Run `npm test` → Test should FAIL (no error logging exists yet)

### Step 2: Fix engine.js (GREEN)

Add runtime error logging for invalid/unknown formatters.

**File:** `src/engine.js`

In `applyFormattingAndPersistence()` function (around line 132-151):

```javascript
let formatterFunction = null;
if (typeof config.applyFormatting === 'function') {
  formatterFunction = config.applyFormatting;
} else if (typeof config.applyFormatting === 'string') {
  formatterFunction = knownFormatters[config.applyFormatting];
  // ADD: Log error if string formatter not found
  if (!formatterFunction) {
    utils.logError(
      `Unknown formatter '${config.applyFormatting}' for handler '${config.id}'. ` +
      `Available formatters: ${Object.keys(knownFormatters).join(', ')}`
    );
  }
} else if (config.applyFormatting !== undefined && config.applyFormatting !== null) {
  // ADD: Log error for invalid type
  utils.logError(
    `Invalid applyFormatting type for handler '${config.id}': ` +
    `expected function or string, got ${typeof config.applyFormatting}`
  );
}
```

Run `npm test` → Test should PASS (GREEN)

### Step 3: Add Build-Time Validation (REFACTOR)

Add config validation to webpack.config.js to catch errors at build time.

**File:** `webpack.config.js`

After loading the custom config (around line 17-28), add validation:

```javascript
// Known formatters that can be used as strings in configs
const KNOWN_FORMATTERS = ['formatFbClickId'];

function validateConfig(configs, configPath) {
  if (!Array.isArray(configs)) {
    throw new Error(`Config at ${configPath} must export an array`);
  }

  const errors = [];
  configs.forEach((handler, index) => {
    if (!handler.id) {
      errors.push(`Handler at index ${index}: missing 'id'`);
    }
    if (!handler.sourceType) {
      errors.push(`Handler '${handler.id || index}': missing 'sourceType'`);
    }

    // Validate applyFormatting
    if (handler.applyFormatting !== undefined) {
      if (typeof handler.applyFormatting === 'function') {
        errors.push(
          `Handler '${handler.id}': applyFormatting is a function reference. ` +
          `Functions are lost during JSON.stringify. Use a string reference instead: ` +
          `applyFormatting: '${handler.applyFormatting.name || 'formatterName'}'`
        );
      } else if (typeof handler.applyFormatting === 'string') {
        if (!KNOWN_FORMATTERS.includes(handler.applyFormatting)) {
          errors.push(
            `Handler '${handler.id}': unknown formatter '${handler.applyFormatting}'. ` +
            `Known formatters: ${KNOWN_FORMATTERS.join(', ')}`
          );
        }
      } else {
        errors.push(
          `Handler '${handler.id}': applyFormatting must be a string, got ${typeof handler.applyFormatting}`
        );
      }
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `Config validation failed for ${configPath}:\n` +
      errors.map(e => `  - ${e}`).join('\n')
    );
  }
}
```

Then modify the config loading block:

```javascript
if (customConfigPath) {
  try {
    const resolvedPath = path.resolve(customConfigPath);
    customConfigsContent = require(resolvedPath);
    validateConfig(customConfigsContent.default || customConfigsContent, resolvedPath);
    console.log(`✓ Config validated: ${resolvedPath}`);
    useCustomConfig = true;
  } catch (e) {
    console.error(`✗ Config error: ${e.message}`);
    process.exit(1);  // Fail the build
  }
}
```

Verify: `npm run build -- --env customConfigPath=./davinci-config.js --env customConfigName=davinci`

→ Build should FAIL with clear error message about function reference

### Step 4: Fix davinci-config.js

Change function reference to string reference.

**File:** `davinci-config.js`

```javascript
// REMOVE this import:
// import { formatFbClickId } from './src/utils.js';

// CHANGE this:
applyFormatting: formatFbClickId,
// TO this:
applyFormatting: 'formatFbClickId',
```

Verify: Build should now SUCCEED

### Step 5: Verify Tests Catch Regression

Temporarily revert davinci-config.js to use function reference again → Build should FAIL, proving the validation works.

---

## Files to Modify

| File | Change |
|------|--------|
| `tests/engine.test.js` | Add test for error logging on unknown formatter |
| `src/engine.js` | Add runtime error logging for invalid formatters |
| `webpack.config.js` | Add build-time config validation |
| `davinci-config.js` | Remove import, use string `'formatFbClickId'` |

**Note:** Other custom configs already use the correct pattern:
- `sc-config.js` - Already uses `applyFormatting: 'formatFbClickId'` (string) ✓
- `c1up-config.js` - Doesn't use fbc handler (no formatters needed) ✓

**Note on Build Targets:** The current ES5/IE11 targeting must be kept because the script is deployed as inline code in GTM Custom HTML tags, which have restrictions on modern JavaScript syntax.

---

## Verification Checklist

1. ✅ `yarn test` → All 48 tests pass including new tests
2. ✅ `yarn build:davinci` → Build succeeds
3. ✅ Build with function reference → Fails with clear error message
4. ✅ Runtime unknown formatter → Logs helpful error message
5. ⬜ Deploy fixed build to staging → Verify fbc values are properly formatted
6. ⬜ Manual test: Set `_fbc` cookie, load page with `?fbclid=xxx`, verify cookie NOT overwritten
7. ⬜ Manual test: Load page with `?fbclid=xxx` and NO existing `_fbc` cookie, verify cookie IS set

---

## Implementation Summary

### Changes Made

| File | Change |
|------|--------|
| `davinci-config.js` | Removed function import, changed to `applyFormatting: 'formatFbClickId'` |
| `src/engine.js` | Added cookie preservation logic + unknown formatter error logging |
| `webpack.config.js` | Added build-time validation for function references |
| `tests/engine.test.js` | Added tests for cookie preservation + unknown formatter logging |

### Cookie Preservation Logic

In `applyFormattingAndPersistence()`, before setting a new cookie:
1. Check if valid `_fbc` cookie exists (starts with 'fb.')
2. If yes: preserve it, update localStorage with its value, return it for form population
3. If no: proceed with normal formatting and cookie setting
