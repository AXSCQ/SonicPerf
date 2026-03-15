/**
 * LazyLoader — Deferred loading of audio files and scripts.
 * Extracted from AstroPrueba MultiTrackAudioVisualizer lazy init + performance-optimizer.
 */

export class LazyLoader {
    constructor() {
        /** @type {Set<string>} */
        this._loaded = new Set();
        this._observer = null;
    }

    /**
     * Lazy load an audio file — returns a promise that resolves with the HTMLAudioElement
     * @param {string} src - Audio URL
     * @param {object} options
     * @param {boolean} [options.crossOrigin=true]
     * @param {string} [options.preload='metadata']
     */
    loadAudio(src, options = {}) {
        return new Promise((resolve, reject) => {
            if (this._loaded.has(src)) {
                resolve(null);
                return;
            }

            const audio = new Audio();
            audio.crossOrigin = options.crossOrigin !== false ? 'anonymous' : '';
            audio.preload = options.preload || 'metadata';
            audio.src = src;

            audio.addEventListener('canplaythrough', () => {
                this._loaded.add(src);
                resolve(audio);
            }, { once: true });

            audio.addEventListener('error', (e) => {
                reject(new Error(`Failed to load audio: ${src}`));
            }, { once: true });
        });
    }

    /**
     * Preload a resource with a link element
     * @param {string} url
     * @param {string} [rel='modulepreload']
     */
    preload(url, rel = 'modulepreload') {
        if (this._loaded.has(url)) return;

        const link = document.createElement('link');
        link.rel = rel;
        link.href = url;
        document.head.appendChild(link);
        this._loaded.add(url);
    }

    /**
     * Load a script lazily
     * @param {string} src
     * @param {object} options
     * @param {boolean} [options.module=false]
     */
    loadScript(src, options = {}) {
        return new Promise((resolve, reject) => {
            if (this._loaded.has(src)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            if (options.module) script.type = 'module';
            script.src = src;
            script.onload = () => {
                this._loaded.add(src);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Preload on hover intent
     * @param {string} selector - Elements to watch
     * @param {string} url - URL to preload
     */
    preloadOnHover(selector, url) {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.preload(url);
            }, { once: true });
        });
    }

    /**
     * Load resources when elements become visible
     * @param {string} selector - Elements to watch
     * @param {Function} loadFn - Function to call when visible
     */
    loadOnVisible(selector, loadFn) {
        if (!this._observer) {
            this._observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const fn = entry.target._sonicPerfLoadFn;
                        if (fn) fn(entry.target);
                        this._observer.unobserve(entry.target);
                        delete entry.target._sonicPerfLoadFn;
                    }
                });
            }, { rootMargin: '100px', threshold: 0.1 });
        }

        document.querySelectorAll(selector).forEach(el => {
            el._sonicPerfLoadFn = loadFn;
            this._observer.observe(el);
        });
    }

    get loadedCount() { return this._loaded.size; }

    destroy() {
        if (this._observer) this._observer.disconnect();
        this._loaded.clear();
    }
}
