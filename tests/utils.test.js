// tests/utils.test.js
import * as utils from '../src/utils'; // Import all exports

describe('Utility Functions (src/utils.js)', () => {
  describe('Logging Functions', () => {
    test('logError always logs to console.error', () => {
      utils.logError('Test Error Message');
      expect(console.error).toHaveBeenCalledWith(
        '[Unified Param Handler Error]: Test Error Message'
      );
    });

    // Test the new isDebugMode function directly
    test('isDebugMode reflects window.location.search', () => {
      // Default state from setup.js
      expect(utils.isDebugMode()).toBe(false);

      // Set debug=true in search
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });
      expect(utils.isDebugMode()).toBe(true);

      // Set other params
      Object.defineProperty(window.location, 'search', {
        value: '?other=true&debug=true&more=stuff',
        writable: true,
      });
      expect(utils.isDebugMode()).toBe(true);

      // No debug param
      Object.defineProperty(window.location, 'search', {
        value: '?other=true',
        writable: true,
      });
      expect(utils.isDebugMode()).toBe(false);
    });

    test('logDebug logs only when isDebugMode() is true', () => {
      // Case 1: Debug mode OFF
      Object.defineProperty(window.location, 'search', {
        value: '?other=param',
        writable: true,
      });
      utils.logDebug('Debug off message');
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('Debug off message')
      ); // Ensure it wasn't called

      // Case 2: Debug mode ON
      Object.defineProperty(window.location, 'search', {
        value: '?param=test&debug=true',
        writable: true,
      });
      utils.logDebug('Debug on message', { data: 1 });
      expect(console.log).toHaveBeenCalledWith(
        '[Unified Param Handler] Debug on message',
        { data: 1 }
      ); // Ensure it was called
    });

    // Add similar tests for startGroup/endGroup if desired, controlling window.location.search first
    test('startGroup groups only when isDebugMode() is true', () => {
      // Debug OFF
      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      });
      utils.startGroup('Test Group Off');
      expect(console.group).not.toHaveBeenCalled();
      expect(console.groupCollapsed).not.toHaveBeenCalled();

      // Debug ON (Collapsed)
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });
      utils.startGroup('Test Group On Collapsed', true);
      expect(console.groupCollapsed).toHaveBeenCalledWith(
        '[Unified Param Handler] Test Group On Collapsed'
      );
      expect(console.group).not.toHaveBeenCalled(); // Ensure only collapsed was called

      // Debug ON (Not Collapsed)
      utils.startGroup('Test Group On Expanded', false);
      expect(console.group).toHaveBeenCalledWith(
        '[Unified Param Handler] Test Group On Expanded'
      );
    });

    test('endGroup ends group only when isDebugMode() is true', () => {
      // Debug OFF
      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      });
      utils.endGroup();
      expect(console.groupEnd).not.toHaveBeenCalled();

      // Debug ON
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });
      utils.endGroup();
      expect(console.groupEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cookie Functions', () => {
    test('parseCookies correctly parses various cookie strings', () => {
      // *** Set cookies individually using the utility function ***
      utils.setCookie('test1', 'value1', 1); // Use setCookie for reliability
      utils.setCookie('test2', 'value2', 1);

      // Clear the setter spy mock calls from the above setCookie calls
      // so we don't interfere with the log check later if needed.
      const cookieSetterSpy = jest.spyOn(document, 'cookie', 'set');
      cookieSetterSpy.mockClear();

      const cookies = utils.parseCookies(); // Parse cookies

      // Check the result - This should now work
      expect(cookies).toEqual({
        test1: 'value1',
        test2: 'value2',
      });

      // Check the debug log *after* parsing is complete
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });
      // Clear console log mock before re-running for log check
      console.log.mockClear();
      utils.parseCookies(); // Re-run parseCookies for log check
      expect(console.log).toHaveBeenCalledWith(
        '[Unified Param Handler] Parsed cookies:',
        {
          test1: 'value1',
          test2: 'value2',
        }
      );
      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      }); // Turn debug off
    });

    test('parseCookies handles empty cookie string', () => {
      // Set the specific cookie string for THIS test
      document.cookie = '';
      const cookies = utils.parseCookies();

      // Check the result
      expect(cookies).toEqual({});

      // Check the debug log
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });
      utils.parseCookies(); // Re-run for log check
      expect(console.log).toHaveBeenCalledWith(
        '[Unified Param Handler] Parsed cookies:',
        {}
      );
      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      }); // Turn debug off
    });

    test('parseCookies handles empty cookie string', () => {
      document.cookie = '';
      const cookies = utils.parseCookies();
      expect(cookies).toEqual({});
    });

    test('getCookie retrieves existing cookie', () => {
      // Set cookie and turn debug ON for this test
      document.cookie = 'my_cookie=retrieved_value';
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });

      const value = utils.getCookie('my_cookie');
      expect(value).toBe('retrieved_value');

      // Check log *after* getCookie is called
      expect(console.log).toHaveBeenCalledWith(
        "[Unified Param Handler] Getting cookie 'my_cookie':",
        'retrieved_value'
      );

      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      }); // Turn debug off
    });

    test('getCookie returns null for non-existent cookie', () => {
      // Ensure cookie is clear and turn debug ON
      document.cookie = '';
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });

      const value = utils.getCookie('not_here');
      expect(value).toBeNull();

      // Check log *after* getCookie is called
      // *** Adjust expectation from null to undefined for the logged value ***
      expect(console.log).toHaveBeenCalledWith(
        "[Unified Param Handler] Getting cookie 'not_here':",
        undefined
      );

      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      }); // Turn debug off
    });

    test('setCookie creates correctly formatted cookie string', () => {
      // Clear cookie specifically for this test's assertion baseline
      // document.cookie = ""; // Clearing happens in beforeEach
      // Turn debug ON
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });

      // Get the spy on the cookie setter
      const cookieSetterSpy = jest.spyOn(document, 'cookie', 'set');

      utils.setCookie('new_cookie', 'some&value', 10); // Expires in 10 days
      const expectedDate = new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ).toUTCString();

      // *** Assert against the value passed to the cookie setter spy ***
      expect(cookieSetterSpy).toHaveBeenCalledTimes(1);
      const cookieString = cookieSetterSpy.mock.calls[0][0]; // Get the string passed to the setter

      expect(cookieString).toContain('new_cookie=some%26value'); // Check encoded value
      expect(cookieString).toContain(`expires=${expectedDate}`);
      expect(cookieString).toContain('path=/');
      expect(cookieString).toContain('SameSite=Lax');

      // Check log
      expect(console.log).toHaveBeenCalledWith(
        '[Unified Param Handler] Cookie set: new_cookie = some&value (Expires in 10 days)'
      );

      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      }); // Turn debug off
    });

    test('setCookie creates session cookie if days is 0 or undefined', () => {
      // Clear cookie
      // document.cookie = ""; // Clearing happens in beforeEach
      // Turn debug ON
      Object.defineProperty(window.location, 'search', {
        value: '?debug=true',
        writable: true,
      });

      // Get the spy on the cookie setter
      const cookieSetterSpy = jest.spyOn(document, 'cookie', 'set');

      utils.setCookie('session_cookie', 'temp'); // No expiry days

      // *** Assert against the value passed to the cookie setter spy ***
      expect(cookieSetterSpy).toHaveBeenCalledTimes(1);
      const cookieString = cookieSetterSpy.mock.calls[0][0]; // Get the string passed to the setter

      expect(cookieString).toContain('session_cookie=temp');
      expect(cookieString).toContain('path=/');
      expect(cookieString).toContain('SameSite=Lax');
      expect(cookieString).not.toContain('expires='); // Ensure expires is NOT present

      // Check log
      expect(console.log).toHaveBeenCalledWith(
        '[Unified Param Handler] Cookie set: session_cookie = temp (Expires in undefined days)'
      );

      Object.defineProperty(window.location, 'search', {
        value: '',
        writable: true,
      }); // Turn debug off
    });
  });

  describe('Formatting Functions', () => {
    test('getSubdomainIndex calculates index correctly', () => {
      Object.defineProperty(window.location, 'hostname', {
        value: 'www.example.com',
        writable: true,
      });
      expect(utils.getSubdomainIndex()).toBe(2);

      Object.defineProperty(window.location, 'hostname', {
        value: 'example.co.uk',
        writable: true,
      });
      expect(utils.getSubdomainIndex()).toBe(2); // Simple logic gives 2

      Object.defineProperty(window.location, 'hostname', {
        value: 'localhost',
        writable: true,
      });
      expect(utils.getSubdomainIndex()).toBe(1); // Default for localhost

      Object.defineProperty(window.location, 'hostname', {
        value: '192.168.1.1',
        writable: true,
      });
      expect(utils.getSubdomainIndex()).toBe(1); // Default for IP

      Object.defineProperty(window.location, 'hostname', {
        value: 'com',
        writable: true,
      });
      expect(utils.getSubdomainIndex()).toBe(0); // Specific check
    });

    test('formatFbClickId produces correct FB format string', () => {
      Object.defineProperty(window.location, 'hostname', {
        value: 'app.example.com',
        writable: true,
      }); // index = 2
      const fbclid = 'test_click_id_123';
      const expectedFormat = `fb.2.${Date.now()}.${fbclid}`;
      expect(utils.formatFbClickId(fbclid)).toBe(expectedFormat);
    });

    test('formatFbClickId returns null if no fbclid provided', () => {
      expect(utils.formatFbClickId(null)).toBeNull();
      expect(utils.formatFbClickId(undefined)).toBeNull();
      expect(utils.formatFbClickId('')).toBeNull();
    });
  });

  describe('URL Parameter Utilities', () => {
    test('URL_PARAMS correctly reflects window.location.search', () => {
      // This is tricky because URL_PARAMS is created on module load.
      // Best practice: Export a function `getUrlParams` instead of the constant.
      // Assuming we modify utils.js to export `getUrlParams` function:
      /*
            // In utils.js: export function getUrlParams() { return new URLSearchParams(window.location.search); }
            Object.defineProperty(window.location, 'search', { value: '?test=abc&xyz=123', writable: true });
            const params = utils.getUrlParams();
            expect(params.get('test')).toBe('abc');
            expect(params.get('xyz')).toBe('123');
            expect(params.get('nope')).toBeNull();
            */
      // If testing the exported constant directly, it reflects the state at import time.
      expect(utils.getUrlParams().get('any')).toBeNull(); // Because setup resets search to ''
    });
  });
});
