/**
 * SonicPerf — Performance optimization utilities for audio-reactive web applications.
 * 
 * Provides lazy loading, animation throttling, resource management,
 * and visibility-based pause/resume.
 * 
 * @version 1.0.0
 */

import { LazyLoader } from './lazy-loader.js';
import { AnimationThrottler } from './animation-throttler.js';
import { ResourceManager } from './resource-manager.js';
import { VisibilityManager } from './visibility-manager.js';

const SonicPerf = {
    /**
     * Create a lazy loader instance
     */
    createLazyLoader() {
        return new LazyLoader();
    },

    /**
     * Create an animation throttler
     * @param {object} config - { targetFPS, useIdleCallback, idleTimeout }
     */
    createThrottler(config = {}) {
        return new AnimationThrottler(config);
    },

    /**
     * Create a resource manager
     */
    createResourceManager() {
        return new ResourceManager();
    },

    /**
     * Create a visibility manager
     */
    createVisibilityManager() {
        return new VisibilityManager();
    },

    LazyLoader,
    AnimationThrottler,
    ResourceManager,
    VisibilityManager,
    version: '1.0.0'
};

export default SonicPerf;
export {
    SonicPerf,
    LazyLoader,
    AnimationThrottler,
    ResourceManager,
    VisibilityManager
};
