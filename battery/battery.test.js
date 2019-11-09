/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'babel-polyfill';
import { renderHook, act } from '@testing-library/react-hooks';

import { useBatteryStatus } from './';

const getBatteryStatus = currentResult => ({
  chargingTime: currentResult.chargingTime,
  dischargingTime: currentResult.dischargingTime,
  level: currentResult.level,
  charging: currentResult.charging
});

describe('useBatteryStatus', () => {
  test(`should return "true" for unsupported case`, () => {
    const { result } = renderHook(() => useBatteryStatus());
  
    expect(result.current.unsupported).toBe(true);
  });
  
  test('should update the batteryStatus state', () => {
    const { result } = renderHook(() => useBatteryStatus());

    const mockBatteryStatus = {
      chargingTime: 20,
      dischargingTime: 40,
      level: 50,
      charging: true
    };
  
    act(() => result.current.updateBatteryStatus(mockBatteryStatus));
  
    expect(getBatteryStatus(result.current)).toEqual(mockBatteryStatus);
  });
  
  test('should return mockGetBattery status', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const mockBatteryStatus = {
      chargingTime: 20,
      dischargingTime: 40,
      level: 50,
      charging: true
    };
  
    const mockGetBattery = jest.fn().mockImplementation(() => Promise.resolve({
      ...mockBatteryStatus,
      addEventListener: jest.fn()
    }));

    global.navigator.getBattery = mockGetBattery;
  
    try {
      const { result, waitForNextUpdate } = renderHook(() => useBatteryStatus());
      await waitForNextUpdate();
      
      expect(getBatteryStatus(result.current)).toEqual(mockBatteryStatus);
    } finally {
      console.error = originalError;
    }
  });
  
  test('should update the batteryStatus state when battery level change event', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const mockBatteryStatus = {
      chargingTime: 20,
      dischargingTime: 40,
      level: 50,
      charging: true
    };

    const mockBattery = {
      ...mockBatteryStatus,
      addEventListener: jest.fn()
    };
    
    const mockGetBattery = jest.fn().mockImplementation(() => Promise.resolve(mockBattery));

    global.navigator.getBattery = mockGetBattery;

    try {
      const { result, waitForNextUpdate } = renderHook(() => useBatteryStatus());
      await waitForNextUpdate();

      // batteryStatus is updated because updateBatteryStatus should be called internally
      expect(getBatteryStatus(result.current)).toEqual(mockBatteryStatus);
    } finally {
      console.error = originalError;
    }
  });
});
