// client/src/utils/activityMonitor.js
let activityTimeout;
const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const startActivityMonitor = (onTimeout) => {
    const resetTimer = () => {
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(onTimeout, TIMEOUT_MS);
    };

    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // initialize first time

    return () => {
        clearTimeout(activityTimeout);
        events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
};
