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

import { useCoreNetworkStatus } from './';

describe('useCoreNetworkStatus', () => {
  test(`should return "{}" for unsupported case`, () => {
    const result = useCoreNetworkStatus();

    expect(result).toStrictEqual({});
  });

  test('should return 4g of effectiveConnectionType', () => {
    global.navigator.connection = {
      effectiveType: '4g'
    };

    const result = useCoreNetworkStatus();

    const expectedConnection = {
        effectiveConnectionType: '4g'
    };

    expect(result).toStrictEqual(expectedConnection);
  });
});
