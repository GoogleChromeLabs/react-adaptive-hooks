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

const tmp = Object.assign({}, global.navigator);

afterEach(function() {
  // Reload hook for every test
  jest.resetModules();
  // reset global.navigator mock to it's initial value after each test
  global.navigator = Object.assign({}, tmp);
});

describe('useHardwareConcurrency', () => {
  test(`should return window.navigator.hardwareConcurrency`, () => {
    const { useHardwareConcurrency } = require('./');
    const { result } = renderHook(() => useHardwareConcurrency());
    expect(result.current.numberOfLogicalProcessors).toBe(
      window.navigator.hardwareConcurrency
    );
  });

  test('should return 4 for device of hardwareConcurrency = 4', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 4,
      configurable: true,
      writable: true
    });
    const { useHardwareConcurrency } = require('./');
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.numberOfLogicalProcessors).toEqual(4);
  });

  test('should return 2 for device of hardwareConcurrency = 2', () => {
    Object.defineProperty(window.navigator, 'hardwareConcurrency', {
      value: 2,
      configurable: true,
      writable: true
    });
    const { useHardwareConcurrency } = require('./');
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.numberOfLogicalProcessors).toEqual(2);
  });

  test('should return `{unsupported: true}` if `navigator` is undefined', () => {
    delete global.navigator;

    const { useHardwareConcurrency } = require('./');
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.unsupported).toEqual(true);
  });

  test('should return `{unsupported: true}` if `navigator.hardwareConcurrency` is not available', () => {
    delete global.navigator.hardwareConcurrency;

    const { useHardwareConcurrency } = require('./');
    const { result } = renderHook(() => useHardwareConcurrency());

    expect(result.current.unsupported).toEqual(true);
  });
});
