// tests/config.test.js
import { defaultHandlerConfigs } from '../src/config';

describe('Default Configuration (src/config.js)', () => {

  test('defaultHandlerConfigs is an array', () => {
    expect(Array.isArray(defaultHandlerConfigs)).toBe(true);
  });

  test('Each config object has required properties', () => {
    if (defaultHandlerConfigs.length === 0) {
        console.warn("Skipping config structure test as defaultHandlerConfigs is empty.");
        return; // Skip if empty
    }
    defaultHandlerConfigs.forEach(config => {
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
      expect(config.id).toBeDefined();
      expect(typeof config.id).toBe('string');
      expect(config.targetInputName).toBeDefined();
      expect(typeof config.targetInputName).toBe('string');

      // *** Allow sourceType to be missing OR be 'user_agent' or 'ip_address' ***
      if (config.sourceType === 'user_agent' || config.sourceType === 'ip_address') {
        // These are special source types, no further checks needed here for url/cookie names
        expect(typeof config.sourceType).toBe('string');
      } else if (config.sourceType) {
        // For standard sourceTypes ('url', 'cookie', 'url_or_cookie')
        expect(typeof config.sourceType).toBe('string');
        expect(['url', 'cookie', 'url_or_cookie']).toContain(config.sourceType);

        // Conditional checks based on standard sourceType
        if (config.sourceType.includes('url')) {
          expect(config.urlParamName).toBeDefined();
          expect(typeof config.urlParamName).toBe('string');
        }
        if (config.sourceType.includes('cookie')) {
          expect(config.cookieName).toBeDefined();
          expect(typeof config.cookieName).toBe('string');
        }
      } else {
        // If sourceType is missing, it must be the old userAgent config (which we might phase out)
        // For now, we allow it to be undefined only if id is userAgent
        expect(config.id).toBe('userAgent'); 
        expect(config.sourceType).toBeUndefined();
      }

       // Check optional property types if they exist
      if (config.applyFormatting) {
          expect(typeof config.applyFormatting).toBe('function');
      }
       if (config.setCookie) {
           expect(typeof config.setCookie).toBe('object');
           expect(typeof config.setCookie.enabledOnUrlHit).toBe('boolean');
           expect(typeof config.setCookie.cookieNameToSet).toBe('string');
           expect(typeof config.setCookie.daysToExpiry).toBe('number');
       }
      if (config.retryMechanism) {
           expect(typeof config.retryMechanism).toBe('object');
           expect(typeof config.retryMechanism.enabled).toBe('boolean');
           expect(typeof config.retryMechanism.maxAttempts).toBe('number');
           expect(typeof config.retryMechanism.interval).toBe('number');
       }
    });
  });

});