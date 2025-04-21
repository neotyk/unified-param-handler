// src/utils.js
export const URL_PARAMS = new URLSearchParams(window.location.search);

export function isDebugMode() {
    // Check the live value each time
    return typeof window !== 'undefined' && window.location.search.includes('debug=true');
}

export function logError(message) {
    console.error(`[Unified Param Handler Error]: ${message}`);
    // Removed alert fallback - generally not desired for production scripts
}

export function logDebug(message, ...args) {
    if (isDebugMode() && typeof console !== 'undefined' && console.log) {
        console.log(`[Unified Param Handler] ${message}`, ...args);
    }
}

export function startGroup(name, collapsed = false) {
    if (isDebugMode() && typeof console !== 'undefined') {
        const groupMethod = collapsed ? console.groupCollapsed : console.group;
        if (groupMethod) {
            groupMethod(`[Unified Param Handler] ${name}`);
        }
    }
}

export function endGroup() {
    if (isDebugMode() && typeof console !== 'undefined' && console.groupEnd) {
        console.groupEnd();
    }
}

export function parseCookies() {
    startGroup('Parsing Cookies', true);
    const cookies = {};
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(function (cookie) {
            const eqPos = cookie.indexOf('=');
            if (eqPos > 0) {
                // Ensure '=' is found and not the first char
                const name = cookie.substring(0, eqPos).trim();
                let value = cookie.substring(eqPos + 1).trim();
                // Decode cookie value, handle potential quotes
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                try {
                    cookies[name] = decodeURIComponent(value);
                } catch (e) {
                    cookies[name] = value; // Fallback to raw value if decoding fails
                    logError(`Failed to decode cookie "${name}": ${e.message}`);
                }
            }
        });
    }
    logDebug('Parsed cookies:', cookies);
    endGroup();
    return cookies;
}

export function getCookie(name) {
    // Always parse fresh cookies
    const currentCookies = parseCookies();
    logDebug(`Getting cookie '${name}':`, currentCookies[name]);
    return currentCookies[name] || null;
}

export function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    // Encode the value for safety
    const encodedValue = encodeURIComponent(value);
    document.cookie =
        name + '=' + encodedValue + expires + '; path=/; SameSite=Lax'; // Added SameSite=Lax for good practice
    logDebug(`Cookie set: ${name} = ${value} (Expires in ${days} days)`);
}

export function getSubdomainIndex() {
    const hostname = window.location.hostname;
    // Basic check for localhost or IP - might need refinement for edge cases
    if (hostname === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
        return 1; // Default for local/IP
    }
    if (hostname === 'com') return 0; // Original check
    const parts = hostname.split('.');
    // Handle cases like example.com (length 2 -> index 1)
    // and www.example.com (length 3 -> index 2)
    // Consider TLDs like .co.uk - this simple logic might need adjustment if specific FB requirements differ.
    return Math.max(1, parts.length - 1); // Ensure at least 1
}

export function formatFbClickId(fbclid) {
    if (!fbclid) return null;
    const subdomainIndex = getSubdomainIndex();
    const creationTime = Date.now();
    return `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
}
