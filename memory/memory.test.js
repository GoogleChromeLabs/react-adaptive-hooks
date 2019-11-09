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

import { renderHook, act } from '@testing-library/react-hooks';
import { useMemoryStatus } from './';

describe('useMemoryStatus', () => {
  const unsupportMessage = require('./').CLIENT_SIDE_UNSUPPORT_MESSAGE;
  test(`should return ${unsupportMessage}`, () => {
    const { result } = renderHook(() => useMemoryStatus());

    expect(result.current.memoryStatus.unsupportMessage).toBe(unsupportMessage);
  });

  test('should return mockMemory status', () => {
    const totalJSHeapSize = 60;
    const usedJSHeapSize = 40;
    const jsHeapSizeLimit = 50;
    const deviceMemory = 4;
    global.window.performance.memory = {
      totalJSHeapSize,
      usedJSHeapSize,
      jsHeapSizeLimit
    };

    global.navigator.deviceMemory = deviceMemory;

    const { result } = renderHook(() => useMemoryStatus());

    const MAX_MEMORY_LIMIT = require('./').MAX_MEMORY_LIMIT;
    const MAX_PERCENT_THRESHOLD = require('./').MAX_PERCENT_THRESHOLD;
    const overUsedMemorySize = usedJSHeapSize - MAX_MEMORY_LIMIT;
    const usedMemoryPercent = usedJSHeapSize / jsHeapSizeLimit * 100;
    const overLoaded = overUsedMemorySize > 0 || usedMemoryPercent > MAX_PERCENT_THRESHOLD;

    expect(result.current.memoryStatus).toEqual({
      totalJSHeapSize,
      usedJSHeapSize,
      jsHeapSizeLimit,
      deviceMemory,
      overLoaded
    });
  });
  
  test('should set memory status', () => {
    const { result } = renderHook(() => useMemoryStatus());

    const mockMemoryStatus = {
      totalJSHeapSize: 10,
      usedJSHeapSize: 10,
      jsHeapSizeLimit: 10,
      deviceMemory: 10,
      overLoaded: false
    };

    act(() => {
      result.current.setMemoryStatus(mockMemoryStatus);
    });

    expect(result.current.memoryStatus).toEqual(mockMemoryStatus)
  });
});
