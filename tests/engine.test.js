// tests/engine.test.js
import { init } from '../src/engine';
import * as utils from '../src/utils'; // Import utils for spying
import { defaultHandlerConfigs } from '../src/config';

// Helper to get a specific config object by ID (makes tests cleaner)
const getConfig = (id) => defaultHandlerConfigs.find((c) => c.id === id);

// Helper to set URL search params for a test
const setUrlParams = (params) => {
  const url = new URL('http://www.example.com');
  url.search = params;
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { search: url.search, hostname: 'www.example.com' },
  });
};

// Helper to add a hidden input to the DOM
const addHiddenInput = (name, value = '') => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  document.body.appendChild(input);
  return input;
};

// *** Declare spy variables with let ***
let setTimeoutSpy;
let logDebugSpy;
let consoleErrorSpy; // <<< Add spy variable for console.error

describe('Core Engine Logic (src/engine.js)', () => {
  beforeEach(() => {
    // Reset mocks and timers before each test
    jest.clearAllMocks();
    jest.useFakeTimers(); // Use fake timers

    // Clear cookies (using the helper from setup.js if available, or manually)
    document.cookie = ''; // Basic clear, setup.js might do more

    // Reset DOM elements
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // *** Assign spies correctly in beforeEach ***
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    logDebugSpy = jest.spyOn(utils, 'logDebug');
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // <<< Spy on console.error and mock implementation

    // Reset window.location.search for predictable isDebugMode()
    Object.defineProperty(window.location, 'search', {
      value: '',
      writable: true,
    });
  });

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
    // Restore spies if needed (though clearAllMocks usually handles it)
    // setTimeoutSpy.mockRestore();
    logDebugSpy.mockRestore(); // <<< Restore logDebug spy
    consoleErrorSpy.mockRestore(); // <<< Restore console.error spy
  });

  test('init processes a simple URL parameter (gclid)', () => {
    const gclidConfig = getConfig('gclid');
    const input = addHiddenInput(gclidConfig.targetInputName);
    Object.defineProperty(window.location, 'search', {
      value: '?gclid=test-gclid-value-123',
      writable: true,
    });
    jest.spyOn(utils.getUrlParams(), 'get').mockImplementation((param) => {
      if (param === 'gclid') return 'test-gclid-value-123';
      return null;
    });

    // *** Pass only the gclid config to init ***
    init([gclidConfig]); // Run initialization with only this config

    expect(input.value).toBe('test-gclid-value-123');
    expect(document.cookie).toContain(
      `gclid=${encodeURIComponent('test-gclid-value-123')}`
    );
    // *** Now this assertion should pass ***
    expect(console.error).not.toHaveBeenCalled();
    // *** Use the spy variable ***
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  test('init processes a simple Cookie parameter (fbp)', () => {
    const fbpConfig = getConfig('fbp');
    const input = addHiddenInput(fbpConfig.targetInputName);
    document.cookie = '_fbp=test-fbp-cookie-value-456';

    // *** Pass only the fbp config to init ***
    init([fbpConfig]);

    expect(input.value).toBe('test-fbp-cookie-value-456');
    // *** Now this assertion should pass ***
    expect(console.error).not.toHaveBeenCalled();
    // *** Use the spy variable ***
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  test('init handles URL_or_Cookie (URL first, FBC)', () => {
    const fbcConfig = getConfig('fbc');
    const input = addHiddenInput(fbcConfig.targetInputName);
    Object.defineProperty(window.location, 'search', {
      value: '?fbclid=test-fbclid-url-789',
      writable: true,
    });
    document.cookie = '_fbc=fb.1.xxxx.cookievalue';
    jest.spyOn(utils.getUrlParams(), 'get').mockImplementation((param) => {
      if (param === 'fbclid') return 'test-fbclid-url-789';
      return null;
    });

    init([fbcConfig]);

    const expectedFormattedValue = utils.formatFbClickId('test-fbclid-url-789');
    expect(input.value).toBe(expectedFormattedValue);
    expect(document.cookie).toContain(
      `_fbc=${encodeURIComponent(expectedFormattedValue)}`
    );
    // *** Use the spy variable ***
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  test('init handles URL_or_Cookie (Cookie second, FBC)', () => {
    const fbcConfig = getConfig('fbc');
    const input = addHiddenInput(fbcConfig.targetInputName);
    Object.defineProperty(window.location, 'search', {
      value: '?other=param',
      writable: true,
    });
    document.cookie = '_fbc=fb.1.xxxx.cookievalue999';
    jest
      .spyOn(utils.getUrlParams(), 'get')
      .mockImplementation((_param) => null); // Ensure underscore prefix

    init([fbcConfig]);

    expect(input.value).toBe('fb.1.xxxx.cookievalue999');
    const setCookieSpy = jest.spyOn(utils, 'setCookie'); // Keep spy for setCookie if needed
    expect(setCookieSpy).not.toHaveBeenCalled();
    // *** Use the spy variable ***
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  test('init triggers retry mechanism for cookie if not found initially (fbp)', () => {
    const fbpConfig = getConfig('fbp');
    const input = addHiddenInput(fbpConfig.targetInputName, 'initialValue');
    // *** Turn debug ON to capture logDebug calls ***
    Object.defineProperty(window.location, 'search', {
      value: '?debug=true',
      writable: true,
    });

    init([fbpConfig]); // Run init - fbp cookie doesn't exist

    expect(input.value).toBe(''); // Input should be cleared initially

    // *** Check if the retry function's initial log was called ***
    expect(logDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Cookie ${fbpConfig.cookieName} not found initially. Starting retry checks`
      )
    );

    // *** Use the spy variable ***
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1); // Retry scheduled
    expect(setTimeoutSpy).toHaveBeenCalledWith(
      expect.any(Function),
      fbpConfig.retryMechanism.interval
    );

    // Simulate cookie appearing later and advance timer
    utils.setCookie(fbpConfig.cookieName, 'late-fbp-value', 1); // Use setCookie
    jest.advanceTimersByTime(fbpConfig.retryMechanism.interval);

    expect(input.value).toBe('late-fbp-value'); // Input updated after retry
    expect(console.error).not.toHaveBeenCalled();
  });

  test('init stops retry after max attempts (fbp)', () => {
    const fbpConfig = getConfig('fbp');
    const input = addHiddenInput(fbpConfig.targetInputName);
    // *** Turn debug ON to capture logDebug calls ***
    Object.defineProperty(window.location, 'search', {
      value: '?debug=true',
      writable: true,
    });

    init([fbpConfig]); // fbp cookie doesn't exist

    expect(input.value).toBe('');

    // *** Check if the retry function's initial log was called ***
    expect(logDebugSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        `Cookie ${fbpConfig.cookieName} not found initially. Starting retry checks`
      )
    );

    // Check that the *first* retry was scheduled using the spy
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    // const initialRetryFn = setTimeoutSpy.mock.calls[0][0]; // Getting function might not be needed

    // Advance timers past max attempts without setting the cookie
    for (let i = 0; i < fbpConfig.retryMechanism.maxAttempts + 2; i++) {
      if (jest.getTimerCount() > 0) {
        jest.advanceTimersByTime(fbpConfig.retryMechanism.interval);
      } else {
        break;
      }
    }

    expect(input.value).toBe(''); // Still empty
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Failed to find ${fbpConfig.cookieName} cookie after ${fbpConfig.retryMechanism.maxAttempts} total attempts`
      )
    );

    // Verify setTimeout wasn't called *more* times than allowed (initial + retries - 1)
    // Total calls should equal maxAttempts
    // *** Use the spy variable ***
    expect(setTimeoutSpy).toHaveBeenCalledTimes(
      fbpConfig.retryMechanism.maxAttempts
    );
  });

  test('init processes handler even if target input is missing (and persists value)', () => {
    const gclidConfig = { ...getConfig('gclid'), persist: true }; // Add persist for this test
    // DON'T add the input
    setUrlParams('?gclid=test-gclid-value-123');

    init([gclidConfig]);

    // The new logic should NOT log an error in this case, it should proceed gracefully.
    expect(console.error).not.toHaveBeenCalled();
    // The key behavior is that the value is still found and persisted.
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'uph_gclid',
      'test-gclid-value-123'
    );
  });

  test('init clears input if value not found and no retry (utm_source)', () => {
    const utmConfig = getConfig('utm_source');
    const input = addHiddenInput(utmConfig.targetInputName, 'preset-value');
    Object.defineProperty(window.location, 'search', {
      value: '?other=param',
      writable: true,
    });
    jest
      .spyOn(utils.getUrlParams(), 'get')
      .mockImplementation((_param) => null); // Ensure underscore prefix

    init([utmConfig]);
    expect(input.value).toBe('');
    // *** Use the spy variable ***
    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });

  test('init handles custom config passed as argument', () => {
    const customConfig = [
      {
        id: 'custom_param',
        sourceType: 'url',
        urlParamName: 'trk',
        targetInputName: 'custom-tracker',
      },
    ];
    const input = addHiddenInput('custom-tracker');
    setUrlParams('?trk=xyz987&debug=true');

    init(customConfig); // Pass the custom config array

    expect(input.value).toBe('xyz987');
    // The log message has changed, so we update the test to reflect the new reality.
    // We can check for the specific log that indicates custom configs are being used at runtime.
    expect(logDebugSpy).toHaveBeenCalledWith(
      'Using customConfigs provided at runtime.'
    );
    expect(logDebugSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Processing Handler: gclid')
    );
  });

  test('init handles invalid config object gracefully', () => {
    const invalidConfig = [
      {
        id: 'valid',
        sourceType: 'url',
        urlParamName: 'valid',
        targetInputName: 'valid-input',
      },
      {
        id: 'invalid',
        /* missing sourceType */ targetInputName: 'invalid-input',
      },
    ];
    addHiddenInput('valid-input');
    addHiddenInput('invalid-input');
    Object.defineProperty(window.location, 'search', {
      value: '?valid=abc',
      writable: true,
    });
    jest
      .spyOn(utils.getUrlParams(), 'get')
      .mockImplementation((_param) => 'abc'); // Ensure underscore prefix

    init(invalidConfig);

    // <<< Update assertion to match the actual error format from utils.logError
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '[Unified Param Handler Error]: Invalid or incomplete handler config:'
      )
    );
    expect(document.querySelector('input[name="valid-input"]').value).toBe(
      'abc'
    ); // Valid one processed
    expect(document.querySelector('input[name="invalid-input"]').value).toBe(
      ''
    ); // Invalid one skipped
  });

  // --- New Test for User Agent ---
  test('init captures User Agent correctly', () => {
    const userAgentConfig = getConfig('userAgent');
    const input = addHiddenInput(userAgentConfig.targetInputName);
    const mockUserAgent = 'Mozilla/5.0 (Test Environment)';

    // Mock navigator.userAgent
    const originalUserAgent = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      value: mockUserAgent,
      writable: true,
      configurable: true,
    });

    init([userAgentConfig]); // Initialize with only the userAgent config

    expect(input.value).toBe(mockUserAgent);
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // <<< Use the spy variable

    // Restore original userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  // --- New Test for Client IP ---
  test('init captures Client IP correctly', async () => {
    const clientIpConfig = getConfig('clientIp');
    const input = addHiddenInput(clientIpConfig.targetInputName);
    const mockIp = '192.0.2.1';

    // Mock global fetch
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockIp + '\n'), // Simulate trailing newline
      })
    );

    init([clientIpConfig]); // Initialize with only the clientIp config

    // Since fetch is asynchronous, we need to wait for the promise chain to resolve
    // Wait for the fetch promise itself to resolve and the subsequent .then() callbacks
    await global.fetch().then((res) => res.text()); // Wait for the mocked fetch and text processing

    expect(global.fetch).toHaveBeenCalledWith(
      'https://checkip.amazonaws.com/',
      expect.any(Object)
    );
    expect(input.value).toBe(mockIp); // Check trimmed IP
    expect(consoleErrorSpy).not.toHaveBeenCalled(); // <<< Use the spy variable

    // Restore original fetch
    global.fetch = originalFetch;
  });

  // --- Persistence Tests ---

  describe('Persistence Logic', () => {
    const utmSourceConfig = { ...getConfig('utm_source'), persist: true }; // Ensure persist is true
    const utmMediumConfig = { ...getConfig('utm_medium'), persist: false }; // Ensure persist is false

    beforeEach(() => {
      // Ensure localStorage is clear and spies are reset for each persistence test
      window.localStorage.clear();
      // Crucially, clear mocks *after* any setup but *before* the test runs.
      jest.clearAllMocks();
    });

    test('Test Case 1: Saves value to localStorage on URL hit when persist is true', () => {
      setUrlParams('?utm_source=google');
      const input = addHiddenInput(utmSourceConfig.targetInputName);

      init([utmSourceConfig]);

      expect(input.value).toBe('google');
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'uph_utm_source',
        'google'
      );
    });

    test('Test Case 2: Retrieves value from localStorage if not in URL', () => {
      // Step 1: Prime localStorage
      window.localStorage.setItem('uph_utm_source', 'facebook');
      // Crucially, clear mocks AFTER priming and BEFORE running the code under test.
      jest.clearAllMocks();

      // Step 2: Load page without URL params and without the cookie
      setUrlParams('');
      document.cookie = ''; // Ensure no relevant cookies exist

      const input = addHiddenInput(utmSourceConfig.targetInputName);

      init([utmSourceConfig]);

      expect(localStorage.getItem).toHaveBeenCalledWith('uph_utm_source');
      expect(input.value).toBe('facebook');
      // Should not save again as it wasn't a "fresh" find from the URL
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('Test Case 3: Updates localStorage with new URL value', () => {
      // Step 1: Prime localStorage with an old value
      window.localStorage.setItem('uph_utm_source', 'google');
      // Crucially, clear mocks AFTER priming and BEFORE running the code under test.
      jest.clearAllMocks();

      // Step 2: Load page with a new URL param
      setUrlParams('?utm_source=bing');
      const input = addHiddenInput(utmSourceConfig.targetInputName);

      init([utmSourceConfig]);

      expect(input.value).toBe('bing');
      // Check that it overwrites the old value
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'uph_utm_source',
        'bing'
      );
    });

    test('Test Case 4: Does not save to localStorage when persist is false', () => {
      setUrlParams('?utm_medium=cpc');
      const input = addHiddenInput(utmMediumConfig.targetInputName);

      init([utmMediumConfig]);

      expect(input.value).toBe('cpc');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('Persists value even if input field is not on the page', () => {
      setUrlParams('?utm_source=twitter');
      // Do NOT add the hidden input to the DOM

      init([utmSourceConfig]);

      // The key is that it saves the value, even without an input to put it in
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'uph_utm_source',
        'twitter'
      );
    });
  });
});
