/**
 * AnimationThrottler — Controls animation frame rate for performance.
 * Extracted from AstroPrueba MultiTrackAudioVisualizer ANALYZE_THROTTLE
 * and requestIdleCallback patterns.
 */

export class AnimationThrottler {
    /**
     * @param {object} config
     * @param {number} [config.targetFPS=30] - Target frames per second
     * @param {boolean} [config.useIdleCallback=true] - Use requestIdleCallback when available
     * @param {number} [config.idleTimeout=33] - Idle callback timeout in ms
     */
    constructor(config = {}) {
        this._targetFPS = config.targetFPS ?? 30;
        this._useIdleCallback = config.useIdleCallback ?? true;
        this._idleTimeout = config.idleTimeout ?? (1000 / this._targetFPS);

        this._rafId = null;
        this._running = false;
        this._frameCount = 0;
        this._skipFrames = Math.max(1, Math.round(60 / this._targetFPS));
        this._callback = null;
        this._lastFrameTime = 0;
    }

    /**
     * Start the throttled animation loop
     * @param {Function} callback - Function to call on each allowed frame
     */
    start(callback) {
        this._callback = callback;
        this._running = true;
        this._lastFrameTime = performance.now();
        this._loop();
        return this;
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this._running = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }

    _loop() {
        if (!this._running) return;

        this._rafId = requestAnimationFrame(() => {
            this._frameCount++;

            // Frame skipping for throttling
            if (this._frameCount % this._skipFrames !== 0) {
                this._loop();
                return;
            }

            const now = performance.now();
            const delta = now - this._lastFrameTime;
            this._lastFrameTime = now;

            if (this._useIdleCallback && 'requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    if (this._callback) this._callback(delta, this._frameCount);
                }, { timeout: this._idleTimeout });
            } else {
                if (this._callback) this._callback(delta, this._frameCount);
            }

            this._loop();
        });
    }

    /**
     * Set target FPS dynamically
     */
    setFPS(fps) {
        this._targetFPS = fps;
        this._skipFrames = Math.max(1, Math.round(60 / fps));
        this._idleTimeout = 1000 / fps;
    }

    get isRunning() { return this._running; }
    get frameCount() { return this._frameCount; }
}
