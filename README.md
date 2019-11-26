# React Adaptive Loading Hooks &amp; Utilities &middot; ![](https://img.shields.io/github/license/GoogleChromeLabs/react-adaptive-hooks.svg) [![Build Status](https://travis-ci.org/GoogleChromeLabs/react-adaptive-hooks.svg?branch=master)](https://travis-ci.org/GoogleChromeLabs/react-adaptive-hooks) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-adaptive-hooks)

> Deliver experiences best suited to a user's device and network constraints (experimental)

This is a suite of [React Hooks](https://reactjs.org/docs/hooks-overview.html) and utilities for adaptive loading based on a user's:

* [Network via effective connection type](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType)
* [Data Saver preferences](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData)
* [Device memory](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory)
* [Logical CPU cores](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency)

It can be used to add patterns for adaptive resource loading, data-fetching, code-splitting and capability toggling.

## Objective

Make it easier to target low-end devices while progressively adding high-end-only features on top. Using these hooks and utilities can help you give users a great experience best suited to their device and network constraints.

## Installation

`npm i react-adaptive-hooks --save` or `yarn add react-adaptive-hooks`

## Usage

You can import the hooks you wish to use as follows:

```js
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { useSaveData } from 'react-adaptive-hooks/save-data';
import { useHardwareConcurrency } from 'react-adaptive-hooks/hardware-concurrency';
import { useMemoryStatus } from 'react-adaptive-hooks/memory';
```

and then use them in your components. Examples for each hook and utility can be found below:

### Network

`useNetworkStatus` React hook for adapting based on network status (effective connection type)

```js
import React from 'react';

import { useNetworkStatus } from 'react-adaptive-hooks/network';

const MyComponent = () => {
  const { effectiveConnectionType } = useNetworkStatus();

  let media;
  switch(effectiveConnectionType) {
    case 'slow-2g':
      media = <img src='...' alt='low resolution' />;
      break;
    case '2g':
      media = <img src='...' alt='medium resolution' />;
      break;
    case '3g':
      media = <img src='...' alt='high resolution' />;
      break;
    case '4g':
      media = <video muted controls>...</video>;
      break;
    default:
      media = <video muted controls>...</video>;
      break;
  }
  
  return <div>{media}</div>;
};
```

`effectiveConnectionType` values can be `slow-2g`, `2g`, `3g`, or `4g`.

This hook accepts an optional `initialEffectiveConnectionType` string argument, which can be used to provide a `effectiveConnectionType` state value when the user's browser does not support the relevant [NetworkInformation API](https://wicg.github.io/netinfo/). Passing an initial value can also prove useful for server-side rendering, where the developer can pass an [ECT Client Hint](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints#ect) to detect the effective network connection type.

```js
// Inside of a functional React component
const initialEffectiveConnectionType = '4g';
const { effectiveConnectionType } = useNetworkStatus(initialEffectiveConnectionType);
```

### Save Data

`useSaveData` utility for adapting based on the user's browser Data Saver preferences.

```js
import React from 'react';

import { useSaveData } from 'react-adaptive-hooks/save-data';

const MyComponent = () => {
  const { saveData } = useSaveData();
  return (
    <div>
      { saveData ? <img src='...' /> : <video muted controls>...</video> }
    </div>
  );
};
```

`saveData` values can be `true` or `false`.

This hook accepts an optional `initialSaveDataStatus` boolean argument, which can be used to provide a `saveData` state value when the user's browser does not support the relevant [NetworkInformation API](https://wicg.github.io/netinfo/). Passing an initial value can also prove useful for server-side rendering, where the developer can pass a server [Save-Data Client Hint](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints#save-data) that has been converted to a boolean to detect the user's data saving preference.

```js
// Inside of a functional React component
const initialSaveDataStatus = true;
const { saveData } = useSaveData(initialSaveDataStatus);
```

### CPU Cores / Hardware Concurrency

`useHardwareConcurrency` utility for adapting to the number of logical CPU processor cores on the user's device.

```js
import React from 'react';

import { useHardwareConcurrency } from 'react-adaptive-hooks/hardware-concurrency';

const MyComponent = () => {
  const { numberOfLogicalProcessors } = useHardwareConcurrency();
  return (
    <div>
      { numberOfLogicalProcessors <= 4 ? <img src='...' /> : <video muted controls>...</video> }
    </div>
  );
};
```

`numberOfLogicalProcessors` values can be the number of logical processors available to run threads on the user's device. 

### Memory

`useMemoryStatus` utility for adapting based on the user's device memory (RAM)

```js
import React from 'react';

import { useMemoryStatus } from 'react-adaptive-hooks/memory';

const MyComponent = () => {
  const { deviceMemory } = useMemoryStatus();
  return (
    <div>
      { deviceMemory < 4 ? <img src='...' /> : <video muted controls>...</video> }
    </div>
  );
};
```

`deviceMemory` values can be the approximate amount of device memory in gigabytes.

This hook accepts an optional `initialMemoryStatus` object argument, which can be used to provide a `deviceMemory` state value when the user's browser does not support the relevant [DeviceMemory API](https://github.com/w3c/device-memory). Passing an initial value can also prove useful for server-side rendering, where the developer can pass a server [Device-Memory Client Hint](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints#save-data) to detect the memory capacity of the user's device.

```js
// Inside of a functional React component
const initialMemoryStatus = { deviceMemory: 4 };
const { deviceMemory } = useMemoryStatus(initialMemoryStatus);
```

### Adaptive Code-loading & Code-splitting

#### Code-loading

Deliver a light, interactive core experience to users and progressively add high-end-only features on top, if a user's hardware can handle it. Below is an example using the Network Status hook:

```js
import React, { Suspense, lazy } from 'react';

import { useNetworkStatus } from 'react-adaptive-hooks/network';

const Full = lazy(() => import(/* webpackChunkName: "full" */ './Full.js'));
const Light = lazy(() => import(/* webpackChunkName: "light" */ './Light.js'));

const MyComponent = () => {
  const { effectiveConnectionType } = useNetworkStatus();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        { effectiveConnectionType === '4g' ? <Full /> : <Light /> }
      </Suspense>
    </div>
  );
};

export default MyComponent;
```

Light.js:
```js
import React from 'react';

const Light = ({ imageUrl, ...rest }) => (
  <img src={imageUrl} {...rest} />
);

export default Light;
```

Full.js:
```js
import React from 'react';
import Magnifier from 'react-magnifier';

const Full = ({ imageUrl, ...rest }) => (
  <Magnifier src={imageUrl} {...rest} />
);

export default Full;
```

#### Code-splitting

We can extend `React.lazy()` by incorporating a check for a device or network signal. Below is an example of network-aware code-splitting. This allows us to conditionally load a light core experience or full-fat experience depending on the user's effective connection speed (via `navigator.connection.effectiveType`).

```js
import React, { Suspense } from 'react';

const Component = React.lazy(() => {
  const effectiveType = navigator.connection ? navigator.connection.effectiveType : null

  let module;
  switch (effectiveType) {
    case '3g':
      module = import(/* webpackChunkName: "light" */ './Light.js');
      break;
    case '4g':
      module = import(/* webpackChunkName: "full" */ './Full.js');
      break;
    default:
      module = import(/* webpackChunkName: "full" */ './Full.js');
      break;
  }

  return module;
});

const App = () => {
  return (
    <div className='App'>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </div>
  );
};

export default App;
```

## Browser Support

* [Network Information API - effectiveType](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType) is available in [Chrome 61+, Opera 48+, Edge 76+, Chrome for Android 76+, Firefox for Android 68+](https://caniuse.com/#search=effectiveType)

* [Save Data API](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData) is available in [Chrome 65+, Opera 62+, Chrome for Android 76+, Opera for Android 46+](https://caniuse.com/#search=saveData)

* [Hardware Concurrency API](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency) is available in [Chrome 37+, Safari 10.1+, Firefox 48+, Opera 24+, Edge 15+, Chrome for Android 76+, Safari on iOS 10.3+, Firefox for Android 68+, Opera for Android 46+](https://caniuse.com/#search=navigator.hardwareConcurrency)

* [Performance memory API](https://developer.mozilla.org/en-US/docs/Web/API/Performance) is a non-standard and only available in [Chrome 7+, Opera, Chrome for Android 18+, Opera for Android](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)

* [Device Memory API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory) is available in [Chrome 63+, Opera 50+, Chrome for Android 76+, Opera for Android 46+](https://caniuse.com/#search=deviceMemory)

## Demos

### Network

* [Network-aware loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-network-aware-loading) with create-react-app ([Live](https://adaptive-loading.web.app/cra-network-aware-loading/))
* [Network-aware code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-network-aware-code-splitting) with create-react-app ([Live](https://adaptive-loading.web.app/cra-network-aware-code-splitting/))
* [Network-aware data-fetching](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-network-aware-data-fetching) with create-react-app ([Live](https://adaptive-loading.web.app/cra-network-aware-data-fetching/))

* [React Movie - network-aware loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-movie-network-aware-loading) ([Live](https://adaptive-loading.web.app/react-movie-network-aware-loading/))
* [React Shrine - network-aware code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-shrine-network-aware-code-splitting) ([Live](https://adaptive-loading.web.app/react-shrine-network-aware-code-splitting/))
* [React eBay - network-aware code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-ebay-network-aware-code-splitting) ([Live](https://adaptive-loading.web.app/react-ebay-network-aware-code-splitting/))
* [React Lottie - network-aware loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-lottie-network-aware-loading) ([Live](https://adaptive-loading.web.app/react-lottie-network-aware-loading/))

### Save Data

* [React Twitter - save-data loading based on Client Hint](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-twitter-save-data-loading(client-hint)) ([Live](https://adaptive-loading.web.app/react-twitter-save-data-loading(client-hint)/))
* [React Twitter - save-data loading based on Hook](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-twitter-save-data-loading(hook)) ([Live](https://adaptive-loading.web.app/react-twitter-save-data-loading(hook)/))

### CPU Cores / Hardware Concurrency

* [Hardware concurrency considerate code-splitting](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-hardware-concurrency-considerate-code-splitting) with create-react-app ([Live](https://adaptive-loading.web.app/cra-hardware-concurrency-considerate-code-splitting/))
* [Hardware concurrency considerate loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-hardware-concurrency-considerate-loading) with create-react-app ([Live](https://adaptive-loading.web.app/cra-hardware-concurrency-considerate-loading/))

### Memory

* [Memory considerate loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-memory-considerate-loading) with create-react-app ([Live](https://adaptive-loading.web.app/cra-memory-considerate-loading/))
* [Memory considerate loading (SketchFab version)](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cra-memory-considerate-loading-sketchfab) with create-react-app ([Live](https://adaptive-loading.web.app/cra-memory-considerate-loading-sketchfab/))
* [Memory-considerate animation-toggling](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/cna-memory-considerate-animation) with create-next-app ([Live](https://adaptive-loading.web.app/cna-memory-considerate-animation/))

* [React Dixie Mesh - memory considerate loading](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-dixie-memory-considerate-loading) ([Live](https://adaptive-loading.web.app/react-dixie-memory-considerate-loading/))

### Hybrid

* [React Youtube - adaptive loading with mix of network, memory and hardware concurrency](https://github.com/GoogleChromeLabs/adaptive-loading/tree/master/react-youtube-adaptive-loading) ([Live](https://adaptive-loading.web.app/react-youtube-adaptive-loading/))


## References

* [Adaptive serving based on network quality](https://web.dev/adaptive-serving-based-on-network-quality/)
* [Adaptive Serving using JavaScript and the Network Information API](https://addyosmani.com/blog/adaptive-serving/)
* [Serving Adaptive Components Using the Network Information API](https://dev.to/vorillaz/serving-adaptive-components-using-the-network-information-api-lbo)

## License

Licensed under the Apache-2.0 license.

## Team

This project is brought to you by [Addy Osmani](https://github.com/addyosmani) and [Anton Karlovskiy](https://github.com/anton-karlovskiy).
