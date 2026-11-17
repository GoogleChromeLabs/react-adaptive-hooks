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
import { useNetworkStatus } from './';

describe('network status metadata', () => {
  let listener;
  const originalConnection = navigator.connection;

  afterEach(() => {
    if (originalConnection === undefined) delete navigator.connection;
    else navigator.connection = originalConnection;
  });

  test.each(['slow-2g', '2g', '3g', '4g'])(
    'keeps supported status after a change to %s', effectiveType => {
      navigator.connection = {
        effectiveType: '4g',
        addEventListener: (event, callback) => { listener = callback; },
        removeEventListener: jest.fn()
      };
      const { result, unmount } = renderHook(() => useNetworkStatus());
      expect(result.current.unsupported).toBe(false);
      navigator.connection.effectiveType = effectiveType;
      act(() => listener());
      expect(result.current.unsupported).toBe(false);
      expect(result.current.effectiveConnectionType).toBe(effectiveType);
      navigator.connection.effectiveType = '3g';
      act(() => listener());
      expect(result.current.unsupported).toBe(false);
      expect(result.current.effectiveConnectionType).toBe('3g');
      unmount();
      expect(navigator.connection.removeEventListener).toHaveBeenCalledWith('change', listener);
    }
  );
});
