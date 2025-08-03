// src/reporting.js
import { logDebug, logError } from './utils.js';

let clarityQueue = [];
let isPolling = false;
let pollingStartTime = null;
const POLLING_INTERVAL = 100; // ms
const MAX_POLLING_DURATION = 10000; // 10 seconds

/**
 * Flushes the queue of pending Clarity events, sending them to the real API.
 * Also reports the time waited for Clarity to become available.
 */
function flushClarityQueue() {
  if (typeof window.clarity !== 'function') {
    logError('flushClarityQueue called but window.clarity is not a function.');
    return;
  }

  // This check ensures we only report the wait time once.
  if (pollingStartTime) {
    const waitTime = Date.now() - pollingStartTime;
    logDebug(`Clarity is now available. Waited ${waitTime}ms.`);
    // Use a string for the value as per Clarity's API
    window.clarity('set', 'uph_waited_for_clarity_ms', waitTime.toString());
    pollingStartTime = null; // Reset start time to prevent re-reporting
  }

  logDebug(`Flushing ${clarityQueue.length} queued Clarity events.`);
  while (clarityQueue.length > 0) {
    const [key, value] = clarityQueue.shift();
    window.clarity('set', key, value);
    logDebug(`Reported queued event to Clarity: ${key} = ${value}`);
  }
}

/**
 * Starts polling for window.clarity to become available.
 */
function startClarityPolling() {
  if (isPolling) {
    return; // Polling has already been initiated.
  }
  isPolling = true;
  pollingStartTime = Date.now();
  logDebug(
    `window.clarity not found. Starting to poll for it every ${POLLING_INTERVAL}ms for up to ${
      MAX_POLLING_DURATION / 1000
    }s.`
  );

  const intervalId = setInterval(() => {
    const elapsedTime = Date.now() - pollingStartTime;

    if (typeof window.clarity === 'function') {
      clearInterval(intervalId);
      isPolling = false;
      flushClarityQueue();
    } else if (elapsedTime > MAX_POLLING_DURATION) {
      clearInterval(intervalId);
      isPolling = false;
      logError(
        `Timed out waiting for MS Clarity. Waited for ${
          MAX_POLLING_DURATION / 1000
        }s. Discarding ${clarityQueue.length} queued events.`
      );
      clarityQueue = []; // Discard queue on timeout.
    }
  }, POLLING_INTERVAL);
}

/**
 * Reports a key-value pair to Microsoft Clarity.
 * If Clarity is not available, it queues the event and starts polling.
 * @param {string} key - The key to report.
 * @param {string} value - The value to report.
 */
export function reportToClarity(key, value) {
  // This is the normal, direct case. Clarity is ready and no queueing is in progress.
  if (typeof window.clarity === 'function' && clarityQueue.length === 0) {
    window.clarity('set', key, value);
    logDebug(`Reported to Clarity: ${key} = ${value}`);
    return;
  }

  // If we are here, it means we must queue the event. This can be because:
  // 1. Clarity isn't ready yet.
  // 2. Clarity just became ready and the queue is about to be flushed.
  // In both cases, adding the event to the queue ensures it's sent in the correct order.
  clarityQueue.push([key, value]);
  logDebug(`Queued Clarity event: ${key} = ${value}`);

  // If Clarity is not yet available, ensure the polling mechanism is running.
  if (typeof window.clarity !== 'function') {
    startClarityPolling(); // This is safe to call multiple times.
  }
}
