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
import { useEffectiveConnectionType } from './';

describe('useEffectiveConnectionType', () => {
  test('should return 4g of effectiveConnectionType', () => {
    global.navigator.connection = {
      effectiveType: '4g',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    const { result } = renderHook(() => useEffectiveConnectionType());
    
    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should update the effectiveConnectionType state', () => {
    global.navigator.connection = {
      effectiveType: '2g',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    const { result } = renderHook(() => useEffectiveConnectionType());
  
    act(() => result.current.updateECTStatus());
  
    expect(result.current.effectiveConnectionType).toEqual('2g');
  });

  test('should update the effectiveConnectionType state when navigator.connection change event', () => {
    const map = {};
    global.navigator.connection = {
      effectiveType: '2g',
      addEventListener: jest.fn().mockImplementation((event, callback) => {
        map[event] = callback;
      }),
      removeEventListener: jest.fn()
    };

    const { result } = renderHook(() => useEffectiveConnectionType());
    global.navigator.connection.effectiveType = '4g';
    act(() => map.change());

    expect(result.current.effectiveConnectionType).toEqual('4g');
  });
});
