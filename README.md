# ⚡ SonicPerf
**Performance Optimization Utilities for Audio-Reactive Web Apps**

![npm bundle size](https://img.shields.io/bundlephobia/minzip/sonicperf)
![npm version](https://img.shields.io/npm/v/sonicperf)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

**SonicPerf** is a JavaScript performance toolkit designed for audio-reactive web applications. It provides lazy loading, FPS-capped animation throttling, resource management, and visibility-based auto pause/resume — ensuring your music-driven web experiences run at peak efficiency even on low-end devices.

Zero dependencies. Plug directly into any audio-reactive setup.

---

## ✨ Features

- 🦥 **Lazy Loader**: Load audio files and heavy resources only when needed — reduce initial page weight.
- 🎛️ **Animation Throttler**: Cap your animation loop to a target FPS (e.g., 30fps on mobile) to save battery and CPU.
- 🧹 **Resource Manager**: Track and release `AudioContext`, `AudioBuffer`, and Web Audio API nodes automatically.
- 👁️ **Visibility Manager**: Auto-pause animations and audio when the browser tab is hidden, auto-resume on return.

---

## 💻 Installation

```bash
npm install sonicperf
```

```javascript
import SonicPerf from 'sonicperf';
```

---

## 🚀 Quick Start

### Animation Throttler (Limit FPS)

```javascript
import SonicPerf from 'sonicperf';

const throttler = SonicPerf.createThrottler({ targetFPS: 30 });

throttler.start((timestamp) => {
    // Your audio-reactive animation loop here
    // Will only fire ~30 times per second, not 60+
    updateVisuals(audioData);
});

// To stop
throttler.stop();
```

### Lazy Loader (Load on Demand)

```javascript
const loader = SonicPerf.createLazyLoader();

// Load audio stems only when user clicks Play
const stems = await loader.loadAll({
    kick: '/audio/kick.mp3',
    bass: '/audio/bass.mp3',
    vocals: '/audio/vocals.mp3'
});
```

### Visibility Manager (Auto Pause/Resume)

```javascript
const visManager = SonicPerf.createVisibilityManager();

visManager.onHidden(() => sonic.pause());   // Pause when tab hidden
visManager.onVisible(() => sonic.play());   // Resume on return
visManager.start();
```

### Resource Manager (Auto Cleanup)

```javascript
const resources = SonicPerf.createResourceManager();

// Register resources to be tracked
resources.register('myContext', audioContext);
resources.register('myBuffer', audioBuffer);

// Release all when done
resources.destroyAll();
```

---

## 📐 API Reference

### `SonicPerf.createThrottler(config?)`

| Option | Default | Description |
|---|---|---|
| `targetFPS` | `60` | Maximum frames per second |
| `useIdleCallback` | `false` | Use `requestIdleCallback` for low-priority work |
| `idleTimeout` | `50` | Idle callback timeout (ms) |

### `SonicPerf.createLazyLoader()`

```javascript
const loader = SonicPerf.createLazyLoader();
await loader.load('kick', '/audio/kick.mp3');       // Single file
await loader.loadAll({ kick: '...', bass: '...' }); // Multiple files
loader.get('kick');                                  // Get loaded buffer
```

### `SonicPerf.createVisibilityManager()`

```javascript
const vm = SonicPerf.createVisibilityManager();
vm.onHidden(callback);   // Called when tab goes hidden
vm.onVisible(callback);  // Called when tab becomes visible
vm.start();              // Begin listening
vm.stop();               // Stop listening
```

### `SonicPerf.createResourceManager()`

```javascript
const rm = SonicPerf.createResourceManager();
rm.register(key, resource);  // Track a resource
rm.get(key);                 // Retrieve a resource
rm.release(key);             // Release one resource
rm.destroyAll();             // Release all resources
```

---

## 🎵 Works Best With

- **[sonicmotion](https://www.npmjs.com/package/sonicmotion)** — Audio stem analysis and DOM animation engine
- **[sonicfx](https://www.npmjs.com/package/sonicfx)** — Advanced audio-reactive visual effects
- **[sonicscroll](https://www.npmjs.com/package/sonicscroll)** — Scroll-triggered animations with audio-aware mode
- **[sonicwave](https://www.npmjs.com/package/sonicwave)** — Canvas waveform and spectrum visualizations

---

## 📄 License

MIT © 2025 axscq
