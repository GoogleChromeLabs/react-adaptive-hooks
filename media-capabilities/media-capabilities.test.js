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

const mediaDecodingConfig = {
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

describe('useMediaCapabilitiesDecodingInfo', () => {
  test('should return supported flag on unsupported platforms', () => {
    jest.isolateModules(() => {
      const { useMediaCapabilitiesDecodingInfo } = require('.');
      const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo(mediaDecodingConfig));

      expect(result.current.supported).toEqual(false);
    })
  });

  test('should return supported flag on unsupported platforms and no config given', () => {
    jest.isolateModules(() => {
      const { useMediaCapabilitiesDecodingInfo } = require('.');
      const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo());
      
      expect(result.current.supported).toEqual(false);
    })
  });

  test('should return initialMediaCapabilitiesInfo for unsupported', () => {
    jest.isolateModules(() => {
      const initialMediaCapabilitiesInfo = {
        supported: true,
        smooth: false,
        powerEfficient: true
      };
      
      const { useMediaCapabilitiesDecodingInfo } = require('.');
      const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo(mediaDecodingConfig, initialMediaCapabilitiesInfo));
      
      expect(result.current.mediaCapabilitiesInfo.supported).toBe(true);
      expect(result.current.mediaCapabilitiesInfo.smooth).toEqual(false);
      expect(result.current.mediaCapabilitiesInfo.powerEfficient).toEqual(true);
    });
  });

  test('should return supported flag when no config given', () => {
    jest.isolateModules(() => {
      global.navigator.mediaCapabilities = {
        decodingInfo: () => new Promise(resolve => resolve(true))
      };

      const { useMediaCapabilitiesDecodingInfo } = require('.');
      const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo());

      expect(result.current.supported).toEqual(true);
    });
  });

  test('should return mediaCapabilitiesInfo for given media configuration', () => {
    jest.isolateModules(() => {
      global.navigator.mediaCapabilities = {
        decodingInfo: () => new Promise(resolve => resolve(mediaCapabilitiesMapper[mediaDecodingConfig.audio.contentType]))
      };

      const { useMediaCapabilitiesDecodingInfo } = require('.');
      const { result, waitForNextUpdate } = renderHook(() => useMediaCapabilitiesDecodingInfo(mediaDecodingConfig));

      act(() => {})

      waitForNextUpdate().then(() => {
        expect(result.current.mediaCapabilitiesInfo.powerEfficient).toEqual(true);
        expect(result.current.mediaCapabilitiesInfo.smooth).toEqual(true);
        expect(result.current.mediaCapabilitiesInfo.supported).toEqual(true);
      });
    });
  });
});