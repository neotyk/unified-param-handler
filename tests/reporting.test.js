import { SourceType } from '../src/constants';
import { init } from '../src/engine.js';
import * as utils from '../src/utils.js';

describe('MS Clarity Reporting', () => {
  let clarityMock;

  beforeEach(() => {
    clarityMock = jest.fn();
    window.clarity = clarityMock;
    document.body.innerHTML = '';
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete window.clarity;
  });

  test('should report to Clarity when a value is found in the URL', () => {
    document.body.innerHTML = '<input name="utm_source" />';
    jest
      .spyOn(utils, 'getUrlParams')
      .mockReturnValue(new URLSearchParams('utm_source=google'));

    init([
      {
        id: 'utm_source',
        sourceType: SourceType.URL,
        urlParamName: 'utm_source',
        targetInputName: 'utm_source',
        reporting: { msClarity: true },
      },
    ]);

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_source_status',
      'found_url'
    );
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_source_value',
      'google'
    );
  });

  test('should report to Clarity when a value is found in a cookie', () => {
    document.body.innerHTML = '<input name="fbc" />';
    jest
      .spyOn(utils, 'getCookie')
      .mockReturnValue('fb.1.1554763746213.AbCdEfGhIjKlMnOpQrStUvWxYz');

    init([
      {
        id: 'fbc',
        sourceType: SourceType.COOKIE,
        cookieName: '_fbc',
        targetInputName: 'fbc',
        reporting: { msClarity: true },
      },
    ]);

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_fbc_status',
      'found_cookie'
    );
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_fbc_value',
      'fb.1.1554763746213.AbCdEfGhIjKlMnOpQrStUvWxYz'
    );
  });

  test('should report to Clarity when a value is found in local storage', () => {
    localStorage.setItem('uph_utm_campaign', 'summer_sale');
    document.body.innerHTML = '<input name="utm_campaign" />';

    init([
      {
        id: 'utm_campaign',
        sourceType: SourceType.URL,
        urlParamName: 'utm_campaign',
        targetInputName: 'utm_campaign',
        persist: true,
        reporting: { msClarity: true },
      },
    ]);

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_campaign_status',
      'found_storage'
    );
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_campaign_value',
      'summer_sale'
    );
  });

  test('should report to Clarity when an input field is not found', () => {
    jest
      .spyOn(utils, 'getUrlParams')
      .mockReturnValue(new URLSearchParams('utm_medium=cpc'));

    init([
      {
        id: 'utm_medium',
        sourceType: SourceType.URL,
        urlParamName: 'utm_medium',
        targetInputName: 'utm_medium',
        reporting: { msClarity: true },
      },
    ]);

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_medium_status',
      'input_not_found'
    );
  });

  test('should report to Clarity when a URL parameter is empty', () => {
    jest
      .spyOn(utils, 'getUrlParams')
      .mockReturnValue(new URLSearchParams('utm_term='));

    init([
      {
        id: 'utm_term',
        sourceType: SourceType.URL,
        urlParamName: 'utm_term',
        targetInputName: 'utm_term',
        reporting: { msClarity: true },
      },
    ]);

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_term_status',
      'ignored_empty_url_param'
    );
  });

  test('should report to Clarity for user_agent handler', () => {
    document.body.innerHTML = '<input name="userAgent" />';
    Object.defineProperty(navigator, 'userAgent', {
      value: 'test-user-agent',
      configurable: true,
    });

    init([
      {
        id: 'userAgent',
        sourceType: SourceType.USER_AGENT,
        targetInputName: 'userAgent',
        reporting: { msClarity: true },
      },
    ]);

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_userAgent_status',
      'found_user_agent'
    );
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_userAgent_value',
      'test-user-agent'
    );
  });

  test('should report to Clarity for ip_address handler', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('127.0.0.1'),
      })
    );

    document.body.innerHTML = '<input name="clientIp" />';

    init([
      {
        id: 'clientIp',
        sourceType: SourceType.IP_ADDRESS,
        targetInputName: 'clientIp',
        reporting: { msClarity: true },
      },
    ]);

    // Since fake timers are in use, we must manually advance them to allow
    // the async fetch operation and its promise chain to complete.
    await jest.runAllTimersAsync();

    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_clientIp_status',
      'found_ip'
    );
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_clientIp_value',
      '127.0.0.1'
    );
  });
});

describe('MS Clarity Async Reporting', () => {
  let clarityMock;
  let logErrorSpy;
  let init;
  let utils;

  // Define a reusable config for the tests
  const utmConfigSource = {
    id: 'utm_source',
    sourceType: SourceType.URL,
    urlParamName: 'utm_source',
    targetInputName: 'utm_source',
    reporting: { msClarity: true },
  };

  beforeEach(() => {
    // Reset modules to clear state like isPolling in reporting.js
    jest.resetModules();
    jest.useFakeTimers();

    // Re-require modules to get fresh copies
    init = require('../src/engine.js').init;
    utils = require('../src/utils.js');

    // Mock window.clarity, but make it undefined initially
    clarityMock = jest.fn();
    Object.defineProperty(window, 'clarity', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    // Spy on console.error to check for timeout messages
    logErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Spy on setInterval to allow assertions
    jest.spyOn(global, 'setInterval');

    // Reset DOM and localStorage
    document.body.innerHTML = '';
    localStorage.clear();
  });

  afterEach(() => {
    // Restore real timers and mocks
    jest.useRealTimers();
    jest.restoreAllMocks();
    delete window.clarity;
  });

  test('should queue events and start polling when Clarity is not available', () => {
    jest
      .spyOn(utils, 'getUrlParams')
      .mockReturnValue(new URLSearchParams('utm_source=queued'));

    init([utmConfigSource]);

    // Assert that clarity was NOT called directly because it's undefined
    expect(clarityMock).not.toHaveBeenCalled();
    // Assert that the polling has started
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 100);
  });

  test('should flush queue and report wait time when Clarity becomes available', () => {
    jest
      .spyOn(utils, 'getUrlParams')
      .mockReturnValue(new URLSearchParams('utm_source=google'));

    init([utmConfigSource]);

    // Nothing should have been called yet
    expect(clarityMock).not.toHaveBeenCalled();

    // Advance time a bit
    jest.advanceTimersByTime(500);

    // Now, make Clarity available
    window.clarity = clarityMock;

    // Advance time to trigger the next poll
    jest.advanceTimersByTime(100);

    // Check that the wait time was reported. The value should be a string.
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_waited_for_clarity_ms',
      '600' // 500ms + 100ms
    );

    // Check that the original queued event was flushed
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_source_status',
      'found_url'
    );
    expect(clarityMock).toHaveBeenCalledWith(
      'set',
      'uph_utm_source_value',
      'google'
    );
  });

  test('should handle timeout and discard the queue', () => {
    jest
      .spyOn(utils, 'getUrlParams')
      .mockReturnValue(new URLSearchParams('utm_source=timeout'));

    init([utmConfigSource]);

    // Advance timers past the 10-second timeout
    jest.advanceTimersByTime(11000);

    // Ensure the error was logged
    expect(logErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Timed out waiting for MS Clarity')
    );

    // Now, make Clarity available
    window.clarity = clarityMock;

    // Advance time again
    jest.advanceTimersByTime(200);

    // Assert that NOTHING was called, because the queue was discarded
    expect(clarityMock).not.toHaveBeenCalled();
  });
});
