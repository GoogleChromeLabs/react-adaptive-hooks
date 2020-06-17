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
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import * as TestUtils from 'react-dom/test-utils';
import { useNetworkStatus } from './';

describe('useNetworkStatus', () => {
  const map = {};

  const ectStatusListeners = {
    addEventListener: jest.fn().mockImplementation((event, callback) => {
      map[event] = callback;
    }),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(event => {
      const callback = map[event.type];
      if (callback) {
        callback(event);
      }
    })
  };

  afterEach(() => {
    Object.values(ectStatusListeners).forEach(listener => listener.mockClear());
  });

  /**
   * Tests that addEventListener or removeEventListener was called during the
   * lifecycle of the useEffect hook within useNetworkStatus
   */
  const testEctStatusEventListenerMethod = method => {
    expect(method).toBeCalledTimes(1);
    expect(method.mock.calls[0][0]).toEqual('change');
    expect(method.mock.calls[0][1].constructor).toEqual(Function);
  };

  test(`should return "true" for unsupported case`, () => {
    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current.unsupported).toBe(true);
  });

  test('should return initialEffectiveConnectionType for unsupported case', () => {
    const initialEffectiveConnectionType = '4g';

    const { result } = renderHook(() =>
      useNetworkStatus(initialEffectiveConnectionType)
    );

    expect(result.current.unsupported).toBe(true);
    expect(result.current.effectiveConnectionType).toBe(
      initialEffectiveConnectionType
    );
  });

  test('should return 4g of effectiveConnectionType', () => {
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '4g'
    };

    const { result } = renderHook(() => useNetworkStatus());

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    expect(result.current.unsupported).toBe(false);
    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should not return initialEffectiveConnectionType for supported case', () => {
    const initialEffectiveConnectionType = '2g';
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '4g'
    };

    const { result } = renderHook(() =>
      useNetworkStatus(initialEffectiveConnectionType)
    );

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    expect(result.current.unsupported).toBe(false);
    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should update the effectiveConnectionType state', () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() =>
      result.current.setNetworkStatus({ effectiveConnectionType: '2g' })
    );

    expect(result.current.effectiveConnectionType).toEqual('2g');
  });

  test('should update the effectiveConnectionType state when navigator.connection change event', () => {
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '2g'
    };

    const { result } = renderHook(() => useNetworkStatus());
    global.navigator.connection.effectiveType = '4g';
    act(() => map.change());

    expect(result.current.effectiveConnectionType).toEqual('4g');
  });

  test('should remove the listener for the navigator.connection change event on unmount', () => {
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '2g'
    };

    const { unmount } = renderHook(() => useNetworkStatus());

    testEctStatusEventListenerMethod(ectStatusListeners.addEventListener);
    unmount();
    testEctStatusEventListenerMethod(ectStatusListeners.removeEventListener);
  });

  test('should pick up updates happened between render & passive effect', () => {
    global.navigator.connection = {
      ...ectStatusListeners,
      effectiveType: '2g'
    };

    function App() {
      const { effectiveConnectionType } = useNetworkStatus();
      return effectiveConnectionType;
    }
    
    // First we render the app without the TestUtils.act
    // wrapper so that passive effects are not flushed.
    const container = document.createElement('div');
    render(createElement(App), container);

    // The first render should be 2g
    expect(container.innerHTML).toBe('2g');
    
    // At this point, we haven't flushed our effects.
    // Now it's the perfect time to dispatch a change
    // event to emulate the issue.
    global.navigator.connection.effectiveType = '4g';
    ectStatusListeners.dispatchEvent(new Event('change'));

    // Still 2g, because we haven't subscribed yet
    expect(container.innerHTML).toBe('2g');

    // Now we subscribe (flush useEffect)
    TestUtils.act(() => {});

    // After the first effect, it should turn to 4g
    expect(container.innerHTML).toBe('4g');

    // Cleanup
    unmountComponentAtNode(container);
  })
});
