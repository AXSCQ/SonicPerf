/**
 * ResourceManager — Intelligent resource lifecycle management.
 * Extracted from AstroPrueba performance-optimizer.js
 */

export class ResourceManager {
    constructor() {
        /** @type {Set<string>} */
        this._loadedModules = new Set();
        /** @type {Map<string, IntersectionObserver>} */
        this._observers = new Map();
        this._initialized = false;
    }

    /**
     * Initialize the resource manager
     */
    init() {
        if (this._initialized) return this;
        this._initialized = true;

        // Setup optimized scroll listener with passive flag
        this._setupScrollListener();

        // Clean up on page unload
        window.addEventListener('beforeunload', () => this.cleanup());

        return this;
    }

    _setupScrollListener() {
        let ticking = false;
        this._scrollCallbacks = [];

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    for (const cb of this._scrollCallbacks) {
                        try { cb(window.scrollY); } catch (e) { /* */ }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Register a throttled scroll callback
     */
    onScroll(callback) {
        if (this._scrollCallbacks) {
            this._scrollCallbacks.push(callback);
        }
        return () => {
            const idx = this._scrollCallbacks?.indexOf(callback);
            if (idx !== undefined && idx >= 0) this._scrollCallbacks.splice(idx, 1);
        };
    }

    /**
     * Mark elements with will-change for GPU optimization
     * @param {string|NodeList} selector
     * @param {string} properties - e.g. 'transform, opacity'
     */
    optimizeElements(selector, properties = 'transform, opacity') {
        const elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : selector;

        elements.forEach(el => {
            el.style.willChange = properties;
        });
    }

    /**
     * Remove will-change optimizations (call when animations are done)
     */
    deoptimizeElements(selector) {
        const elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : selector;

        elements.forEach(el => {
            el.style.willChange = '';
        });
    }

    /**
     * Track a loaded module to avoid duplicate loading
     */
    markLoaded(name) {
        this._loadedModules.add(name);
    }

    isLoaded(name) {
        return this._loadedModules.has(name);
    }

    /**
     * Disconnect all observers and clean up
     */
    cleanup() {
        this._observers.forEach(observer => observer.disconnect());
        this._observers.clear();
        this._loadedModules.clear();
        this._scrollCallbacks = [];
    }
}
