/**
 * Returns a wrapped version of the given function that can only be called once at a time.
 * While the function is running, further calls are ignored until it completes.
 * @param {Function} fn - The async function to wrap.
 * @returns {Function}
 */
export function onceAsync(fn) {
  let isRunning = false;
  return async function (...args) {
    if (isRunning) return;
    isRunning = true;
    try {
      await fn.apply(this, args);
    } finally {
      isRunning = false;
    }
  };
}