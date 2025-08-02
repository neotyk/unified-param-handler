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
        sourceType: 'url',
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
        sourceType: 'cookie',
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
        sourceType: 'url',
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
        sourceType: 'url',
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
        sourceType: 'url',
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
        sourceType: 'user_agent',
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
        sourceType: 'ip_address',
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
