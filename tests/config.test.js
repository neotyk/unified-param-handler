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
      expect(config.sourceType).toBeDefined();
      expect(typeof config.sourceType).toBe('string');
      expect(['url', 'cookie', 'url_or_cookie']).toContain(config.sourceType);
      expect(config.targetInputName).toBeDefined();
      expect(typeof config.targetInputName).toBe('string');

      // Conditional checks based on sourceType
      if (config.sourceType.includes('url')) {
        expect(config.urlParamName).toBeDefined();
        expect(typeof config.urlParamName).toBe('string');
      }
      if (config.sourceType.includes('cookie')) {
        expect(config.cookieName).toBeDefined();
        expect(typeof config.cookieName).toBe('string');
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