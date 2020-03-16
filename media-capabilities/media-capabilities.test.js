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

const mediaConfig = {
  type: 'file',
  audio: {
    contentType: 'audio/mp3',
    channels: 2,
    bitrate: 132700,
    samplerate: 5200
  }
};

const mediaCapabilitiesMapper = {
  'audio/mp3': {
    powerEfficient: true,
    smooth: true,
    supported: true
  }
};

describe('useMediaCapabilities', () => {
  test('should return supported flag on unsupported platforms', () => {
    jest.isolateModules(() => {
      const { useMediaCapabilities } = require('./');
      const { result } = renderHook(() => useMediaCapabilities(mediaConfig));
      
      expect(result.current.supported).toEqual(false);
    })
  });

  test('should return supported and hasMediaConfig flags on unsupported platforms and no config given', () => {
    jest.isolateModules(() => {
      const { useMediaCapabilities } = require('./');
      const { result } = renderHook(() => useMediaCapabilities());
      
      expect(result.current.supported).toEqual(false);
    })
  });

  test('should return initialMediaCapabilities for unsupported', () => {
    jest.isolateModules(() => {
      const initialMediaCapabilities = {
        supported: true,
        smooth: false,
        powerEfficient: true
      };
      
      const { useMediaCapabilities } = require('./');
      const { result } = renderHook(() => useMediaCapabilities(mediaConfig, initialMediaCapabilities));
      
      expect(result.current.supported).toBe(true);
      expect(result.current.smooth).toEqual(false);
      expect(result.current.powerEfficient).toEqual(true);
    });
  });

  test('should return hasMediaConfig flag when no config given', () => {
    jest.isolateModules(() => {
      global.navigator.mediaCapabilities = true;
      
      const { useMediaCapabilities } = require('./');
      const { result } = renderHook(() => useMediaCapabilities());
      
      expect(result.current.supported).toEqual(true);
    });
  });

  test('should return MediaDecodingConfiguration for given media configuration', () => {
    jest.isolateModules(() => {
      global.navigator.mediaCapabilities = {
        decodingInfo: (mediaConfig) => new Promise(resolve => resolve(mediaCapabilitiesMapper[mediaConfig.audio.contentType]))
      };
      
      const { useMediaCapabilities } = require('./');
      const { result, waitForNextUpdate } = renderHook(() => useMediaCapabilities(mediaConfig));
      
      waitForNextUpdate().then(() => {
        expect(result.current.powerEfficient).toEqual(true);
        expect(result.current.smooth).toEqual(true);
        expect(result.current.supported).toEqual(true);
      });
    });
  });

  test('should update the mediaCapabilities state', () => {
    jest.isolateModules(() => {
      const { useMediaCapabilities } = require('./');
      const { result } = renderHook(() => useMediaCapabilities());
      
      const mockMediaCapabilitiesStatus = {
        powerEfficient: false,
        smooth: false,
        supported: false
      };
      
      act(() => result.current.updateMediaCapabilities(mockMediaCapabilitiesStatus));
      
      expect(result.current.powerEfficient).toEqual(mockMediaCapabilitiesStatus.powerEfficient);
      expect(result.current.smooth).toEqual(mockMediaCapabilitiesStatus.smooth);
      expect(result.current.supported).toEqual(mockMediaCapabilitiesStatus.supported);
    });
  });
});