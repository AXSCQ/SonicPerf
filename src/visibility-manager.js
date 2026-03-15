/**
 * VisibilityManager — Manages animation lifecycle based on tab/viewport visibility.
 * Pauses expensive operations when the page is not visible.
 */

export class VisibilityManager {
    constructor() {
        /** @type {Set<Function>} */
        this._onHideCallbacks = new Set();
        /** @type {Set<Function>} */
        this._onShowCallbacks = new Set();
        this._isTabVisible = !document.hidden;

        this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this._handleVisibilityChange);
    }

    _handleVisibilityChange() {
        this._isTabVisible = !document.hidden;

        if (this._isTabVisible) {
            for (const cb of this._onShowCallbacks) {
                try { cb(); } catch (e) { /* */ }
            }
        } else {
            for (const cb of this._onHideCallbacks) {
                try { cb(); } catch (e) { /* */ }
            }
        }
    }

    /**
     * Register callback for when tab becomes hidden
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    onHide(callback) {
        this._onHideCallbacks.add(callback);
        return () => this._onHideCallbacks.delete(callback);
    }

    /**
     * Register callback for when tab becomes visible
     * @param {Function} callback
     * @returns {Function} unsubscribe
     */
    onShow(callback) {
        this._onShowCallbacks.add(callback);
        return () => this._onShowCallbacks.delete(callback);
    }

    /**
     * Auto-pause/resume a pausable object (must have pause() and play()/resume() methods)
     * @param {object} target - Object with pause/play or pause/resume methods
     */
    autoPause(target) {
        const pauseFn = () => {
            if (target.pause) target.pause();
        };
        const resumeFn = () => {
            if (target.play) target.play();
            else if (target.resume) target.resume();
        };

        this.onHide(pauseFn);
        this.onShow(resumeFn);

        return () => {
            this._onHideCallbacks.delete(pauseFn);
            this._onShowCallbacks.delete(resumeFn);
        };
    }

    get isTabVisible() { return this._isTabVisible; }

    destroy() {
        document.removeEventListener('visibilitychange', this._handleVisibilityChange);
        this._onHideCallbacks.clear();
        this._onShowCallbacks.clear();
    }
}
