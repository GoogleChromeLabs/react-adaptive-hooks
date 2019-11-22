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

afterEach(function() {
  // Reload hook for every test
  jest.resetModules();
});

describe('useSaveData', () => {
  test(`should return "true" for unsupported case`, () => {
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.unsupported).toBe(true);
    expect(result.current.saveData).toEqual(null);
  });

  test('should return initialSaveDataStatus for unsupported case', () => {
    const initialSaveDataStatus = true;
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData(initialSaveDataStatus));

    expect(result.current.unsupported).toBe(true);
    expect(result.current.saveData).toBe(initialSaveDataStatus);
  });

  test(`should return "true" for enabled save data`, () => {
    global.navigator.connection = {
      saveData: true
    };
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.unsupported).toBe(false);
    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });

  test(`should return "false" for disabled save data`, () => {
    global.navigator.connection = {
      saveData: false
    };
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.unsupported).toBe(false);
    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });

  test('should not return initialSaveDataStatus for supported case', () => {
    const initialSaveDataStatus = false;
    global.navigator.connection = {
      saveData: true
    };
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData(initialSaveDataStatus));

    expect(result.current.unsupported).toBe(false);
    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });
});
