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

import { renderHook } from '@testing-library/react-hooks';

afterEach(function() {
  // Reload hook for every test
  jest.resetModules();
});

const getMemoryStatus = currentResult => ({
  deviceMemory: currentResult.deviceMemory,
  totalJSHeapSize: currentResult.totalJSHeapSize,
  usedJSHeapSize: currentResult.usedJSHeapSize,
  jsHeapSizeLimit: currentResult.jsHeapSizeLimit
});

describe('useMemoryStatus', () => {
  test(`should return "true" for unsupported case`, () => {
    const { useMemoryStatus } = require('./');
    const { result } = renderHook(() => useMemoryStatus());

    expect(result.current.unsupported).toBe(true);
  });

  test('should return mockMemory status', () => {
    const mockMemoryStatus = {
      deviceMemory: 4,
      totalJSHeapSize: 60,
      usedJSHeapSize: 40,
      jsHeapSizeLimit: 50
    };

    global.navigator.deviceMemory = mockMemoryStatus.deviceMemory;

    global.window.performance.memory = {
      totalJSHeapSize: mockMemoryStatus.totalJSHeapSize,
      usedJSHeapSize: mockMemoryStatus.usedJSHeapSize,
      jsHeapSizeLimit: mockMemoryStatus.jsHeapSizeLimit
    };

    const { useMemoryStatus } = require('./');
    const { result } = renderHook(() => useMemoryStatus());

    expect(getMemoryStatus(result.current)).toEqual(mockMemoryStatus);
  });
});
