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

describe('useSaveData', () => {
  test(`should return "true" for unsupported case`, () => {
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());
    expect(result.current.unsupported).toBe(true);
  });

  test(`should return "true" for enabled save data`, () => {
    global.navigator.connection = {
      saveData: true
    };
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });

  test(`should return "false" for disabled save data`, () => {
    global.navigator.connection = {
      saveData: false
    };
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());

    expect(result.current.saveData).toEqual(navigator.connection.saveData);
  });

  test('should return `{unsupported: true}` if navigator is unavailable', () => {
    delete global.navigator;
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());
    expect(result.current.unsupported).toBe(true);
  });

  test('should return `{unsupported: true}` if navigator.connection is unavailable', () => {
    delete global.navigator.connection;
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());
    expect(result.current.unsupported).toBe(true);
  });

  test('should return `{unsupported: true}` if navigator.connection.saveData is unavailable', () => {
    global.navigator.connection = {};
    const { useSaveData } = require('./');
    const { result } = renderHook(() => useSaveData());
    expect(result.current.unsupported).toBe(true);
  });
});
