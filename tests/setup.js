// tests/setup.js

// Mock console methods to prevent test runner noise and allow assertions
global.console = {
    log: jest.fn(), // Use jest.fn() to mock
    warn: jest.fn(), // Use jest.fn() to mock
    error: jest.fn(), // Use jest.fn() to mock
    group: jest.fn(),
    groupCollapsed: jest.fn(),
    groupEnd: jest.fn(),
};

// Helper function to clear all cookies known to JSDOM
function clearAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // Set expiry date to the past to delete the cookie
        document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    // Final clear just in case
    document.cookie = '';
}

// Store the original cookie descriptor
const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                               Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie'); // Fallback for older JSDOM/browsers

// Reset DOM/BOM mocks before each test
beforeEach(() => {
    // Reset JSDOM state if needed (location, cookies)
    Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, search: '', hostname: 'www.example.com' }, // Reset search and hostname
    });

    // *** Spy on the document.cookie setter ***
    if (originalCookieDescriptor) {
        Object.defineProperty(document, 'cookie', {
            ...originalCookieDescriptor,
            set: jest.fn(originalCookieDescriptor.set), // Spy on the original setter
        });
    }

    // *** Use the more robust cookie clearing ***
    clearAllCookies();

    document.head.innerHTML = ''; // Clear head
    document.body.innerHTML = ''; // Clear body

    // Reset Jest's mock function calls
    jest.clearAllMocks();

    // Use fake timers for setTimeout/setInterval control
    jest.useFakeTimers();
});

afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
});

// Mock Date.now() for consistent timestamps in tests
const MOCK_DATE_NOW = 1678886400000; // Example: March 15, 2023 12:00:00 PM UTC
global.Date.now = jest.fn(() => MOCK_DATE_NOW);

// --- Helper to simulate adding hidden inputs ---
global.addHiddenInput = (name, value = '') => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    document.body.appendChild(input);
    return input;
};