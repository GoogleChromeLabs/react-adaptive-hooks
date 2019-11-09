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

let unsupported;

const useMemoryStatus = () => {
  if ('deviceMemory' in navigator) {
    unsupported = false;
  } else {
    unsupported = true;
  }

  let initialMemoryStatus;
  if (!unsupported) {
    const performanceMemory = ('memory' in performance) ? performance.memory : null;
    initialMemoryStatus = {
      deviceMemory: navigator.deviceMemory,
      totalJSHeapSize: performanceMemory ? performanceMemory.totalJSHeapSize : null,
      usedJSHeapSize: performanceMemory ? performanceMemory.usedJSHeapSize : null,
      jsHeapSizeLimit: performanceMemory ? performanceMemory.jsHeapSizeLimit : null
    };
  } else {
    initialMemoryStatus = {unsupported};
  }

  const [memoryStatus] = useState(initialMemoryStatus);

  return { ...memoryStatus };
};

export { useMemoryStatus };
