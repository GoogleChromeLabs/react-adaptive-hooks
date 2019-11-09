/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState } from 'react';

export const CLIENT_SIDE_UNSUPPORT_MESSAGE = 'The Memory Status API is not supported on this platform.';
const SERVER_SIDE_UNSUPPORT_MESSAGE = 'This Memory React Hook uses Window interface so it\'s not possible to use this on Server Side Rendering';

// Tune these for your application
export const MAX_MEMORY_LIMIT = 50 * 1048576; // 50MB
export const MAX_PERCENT_THRESHOLD = 90;

const isWindowUndefined = typeof window === 'undefined';

const useMemoryStatus = () => {
  const isMemorySupported = () => {
    return !isWindowUndefined && window.performance && window.performance.memory && navigator.deviceMemory;
  };

  const getTotalJSHeapSize = () => window.performance.memory.totalJSHeapSize;
  const getUsedJSHeapSize = () => window.performance.memory.usedJSHeapSize;
  const getJSHeapSizeLimit = () => window.performance.memory.jsHeapSizeLimit;
  const getDeviceMemory = () => navigator.deviceMemory;

  const getOverUsedMemorySize = () => {
    const usedJSHeapSize = getUsedJSHeapSize();
    const overUsedMemorySize = usedJSHeapSize - MAX_MEMORY_LIMIT;
    return overUsedMemorySize;
  };

  const getUsedMemoryPercent = () => {
    const usedJSHeapSize = getUsedJSHeapSize();
    const jsHeapSizeLimit = getJSHeapSizeLimit();
    const usedMemoryPercent = usedJSHeapSize / jsHeapSizeLimit * 100;
    return usedMemoryPercent;
  };

  let initialMemoryStatus;
  if (isMemorySupported()) {
    const overUsedMemorySize = getOverUsedMemorySize();
    const usedMemoryPercent = getUsedMemoryPercent();
    let overLoaded = false;
    // Check if we've exceeded absolute memory limit
    if (overUsedMemorySize > 0) {
      overLoaded = true;
    }
    // Check if we've exceeded relative memory limit for client
    if (usedMemoryPercent > MAX_PERCENT_THRESHOLD) {
      overLoaded = true;
    }

    initialMemoryStatus = {
      totalJSHeapSize: getTotalJSHeapSize(),
      usedJSHeapSize: getUsedJSHeapSize(),
      jsHeapSizeLimit: getJSHeapSizeLimit(),
      deviceMemory: getDeviceMemory(),
      overLoaded
    };
  } else {
    let unsupportMessage;
    // server side rendering
    if (isWindowUndefined) {
      // MEMO: we must use client side (browser) features like window and navigator after components are mounted
      // so we could put the logic with client features into useEffect hook.
      // inspired by https://github.com/zeit/next.js/wiki/FAQ#i-use-a-library-which-throws-window-is-undefined
      unsupportMessage = SERVER_SIDE_UNSUPPORT_MESSAGE;
    // client side rendering
    } else {
      unsupportMessage = CLIENT_SIDE_UNSUPPORT_MESSAGE;
    }
    initialMemoryStatus = {unsupportMessage};
  }

  const [memoryStatus, setMemoryStatus] = useState(initialMemoryStatus);

  return {memoryStatus, setMemoryStatus};
};

export { useMemoryStatus };
