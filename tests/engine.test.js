// tests/engine.test.js
import { init } from '../src/engine';
import * as utils from '../src/utils'; // Import utils for spying
import { defaultHandlerConfigs } from '../src/config';

// Helper to get a specific config object by ID (makes tests cleaner)
const getConfig = (id) => defaultHandlerConfigs.find(c => c.id === id);

// *** Declare spy variables with let ***
let setTimeoutSpy;
let logDebugSpy;

describe('Core Engine Logic (src/engine.js)', () => {
    beforeEach(() => {
        // Reset mocks and timers before each test
        jest.clearAllMocks();
        jest.useFakeTimers(); // Use fake timers

        // Clear cookies (using the helper from setup.js if available, or manually)
        document.cookie = ""; // Basic clear, setup.js might do more

        // Reset DOM elements
        document.body.innerHTML = '';
        document.head.innerHTML = '';

        // *** Assign spies correctly in beforeEach ***
        setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        logDebugSpy = jest.spyOn(utils, 'logDebug');

        // Reset window.location.search for predictable isDebugMode()
        setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        // Re-spy on logDebug for each test <<< Add spy setup
        logDebugSpy = jest.spyOn(utils, 'logDebug');

        // Reset window.location.search for predictable isDebugMode()
        Object.defineProperty(window.location, 'search', { value: '', writable: true });
    });

    afterEach(() => {
        // Restore real timers
        jest.useRealTimers();
        // Restore spies if needed (though clearAllMocks usually handles it)
        // setTimeoutSpy.mockRestore();
        logDebugSpy.mockRestore(); // <<< Restore logDebug spy
    });

    test('init processes a simple URL parameter (gclid)', () => {
        const gclidConfig = getConfig('gclid');
        const input = addHiddenInput(gclidConfig.targetInputName);
        Object.defineProperty(window.location, 'search', { value: '?gclid=test-gclid-value-123', writable: true });
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => {
            if (param === 'gclid') return 'test-gclid-value-123';
            return null;
        });

        // *** Pass only the gclid config to init ***
        init([gclidConfig]); // Run initialization with only this config

        expect(input.value).toBe('test-gclid-value-123');
        expect(document.cookie).toContain(`gclid=${encodeURIComponent('test-gclid-value-123')}`);
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
        Object.defineProperty(window.location, 'search', { value: '?fbclid=test-fbclid-url-789', writable: true });
        document.cookie = '_fbc=fb.1.xxxx.cookievalue';
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => {
            if (param === 'fbclid') return 'test-fbclid-url-789';
            return null;
        });

        init([fbcConfig]);

        const expectedFormattedValue = utils.formatFbClickId('test-fbclid-url-789');
        expect(input.value).toBe(expectedFormattedValue);
        expect(document.cookie).toContain(`_fbc=${encodeURIComponent(expectedFormattedValue)}`);
        // *** Use the spy variable ***
        expect(setTimeoutSpy).not.toHaveBeenCalled();
    });


    test('init handles URL_or_Cookie (Cookie second, FBC)', () => {
        const fbcConfig = getConfig('fbc');
        const input = addHiddenInput(fbcConfig.targetInputName);
        Object.defineProperty(window.location, 'search', { value: '?other=param', writable: true });
        document.cookie = '_fbc=fb.1.xxxx.cookievalue999';
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => null);

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
        Object.defineProperty(window.location, 'search', { value: '?debug=true', writable: true });

        init([fbpConfig]); // Run init - fbp cookie doesn't exist

        expect(input.value).toBe(''); // Input should be cleared initially

        // *** Check if the retry function's initial log was called ***
        expect(logDebugSpy).toHaveBeenCalledWith(
            expect.stringContaining(`Cookie ${fbpConfig.cookieName} not found initially. Starting retry checks`)
        );

        // *** Use the spy variable ***
        expect(setTimeoutSpy).toHaveBeenCalledTimes(1); // Retry scheduled
        expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), fbpConfig.retryMechanism.interval);

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
        Object.defineProperty(window.location, 'search', { value: '?debug=true', writable: true });

        init([fbpConfig]); // fbp cookie doesn't exist

        expect(input.value).toBe('');

        // *** Check if the retry function's initial log was called ***
        expect(logDebugSpy).toHaveBeenCalledWith(
            expect.stringContaining(`Cookie ${fbpConfig.cookieName} not found initially. Starting retry checks`)
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
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Failed to find ${fbpConfig.cookieName} cookie after ${fbpConfig.retryMechanism.maxAttempts} total attempts`));

        // Verify setTimeout wasn't called *more* times than allowed (initial + retries - 1)
        // Total calls should equal maxAttempts
        // *** Use the spy variable ***
        expect(setTimeoutSpy).toHaveBeenCalledTimes(fbpConfig.retryMechanism.maxAttempts);

    });

    test('init skips handler if target input is missing', () => {
        const gclidConfig = getConfig('gclid');
        // DON'T add the input: addHiddenInput(gclidConfig.targetInputName);
        Object.defineProperty(window.location, 'search', { value: '?gclid=test-gclid-value-123', writable: true });
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => 'test-gclid-value-123');

        init();

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining(`Target input '${gclidConfig.targetInputName}' for 'gclid' not found. Skipping.`));
        // Ensure no cookie was set etc.
        expect(document.cookie).toBe('');
    });

    test('init clears input if value not found and no retry (utm_source)', () => {
        const utmConfig = getConfig('utm_source');
        const input = addHiddenInput(utmConfig.targetInputName, 'preset-value');
        Object.defineProperty(window.location, 'search', { value: '?other=param', writable: true });
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => null);

        init([utmConfig]);
        expect(input.value).toBe('');
        // *** Use the spy variable ***
        expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    test('init handles custom config passed as argument', () => {
        const customConfig = [
            { id: 'custom_param', sourceType: 'url', urlParamName: 'trk', targetInputName: 'custom-tracker' }
        ];
        const input = addHiddenInput('custom-tracker');
        Object.defineProperty(window.location, 'search', { value: '?trk=xyz987&debug=true', writable: true }); // *** Add &debug=true ***
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => {
            if (param === 'trk') return 'xyz987';
            return null;
        });

        init(customConfig); // Pass the custom config array

        expect(input.value).toBe('xyz987');
        // *** Now this log should be called ***
        expect(console.log).toHaveBeenCalledWith('[Unified Param Handler] Using configurations:', customConfig);
        expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining("Processing Handler: gclid"));
    });

    test('init handles invalid config object gracefully', () => {
        const invalidConfig = [
            { id: 'valid', sourceType: 'url', urlParamName: 'valid', targetInputName: 'valid-input' },
            { id: 'invalid', /* missing sourceType */ targetInputName: 'invalid-input' }
        ];
        addHiddenInput('valid-input');
        addHiddenInput('invalid-input');
        Object.defineProperty(window.location, 'search', { value: '?valid=abc', writable: true });
        jest.spyOn(utils.URL_PARAMS, 'get').mockImplementation((param) => 'abc');

        init(invalidConfig);

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Invalid handler config:"));
        expect(document.querySelector('input[name="valid-input"]').value).toBe('abc'); // Valid one processed
        expect(document.querySelector('input[name="invalid-input"]').value).toBe(''); // Invalid one skipped
    });

});