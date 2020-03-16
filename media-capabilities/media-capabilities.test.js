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

afterEach(function() {
  // Reload hook for every test
  jest.resetModules();
});

describe('useMediaCapabilitiesDecodingInfo', () => {
  const navigator = window.navigator;

  afterEach(() => {
    if (!window.navigator) window.navigator = navigator;
  });

  test('should return supported flag on unsupported platforms', () => {
    const { useMediaCapabilitiesDecodingInfo } = require('./');
    const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo(mediaDecodingConfig));

    expect(result.current.mediaCapabilitiesInfo).toEqual({hasMediaDecodingConfig: true, supported: false});
  });

  test('should return supported and hasMediaDecodingConfig flags on unsupported platforms and no config given', () => {
    const { useMediaCapabilitiesDecodingInfo } = require('./');
    const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo());
    
    expect(result.current.mediaCapabilitiesInfo).toEqual({hasMediaDecodingConfig: false, supported: false});
  });

  test('should return initialMediaCapabilitiesInfo for unsupported', () => {
    const initialMediaCapabilitiesInfo = {
      supported: true,
      smooth: false,
      powerEfficient: true
    };
    const { useMediaCapabilitiesDecodingInfo } = require('./');
    const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo(mediaDecodingConfig, initialMediaCapabilitiesInfo));

    expect(result.current.mediaCapabilitiesInfo.supported).toBe(true);
    expect(result.current.mediaCapabilitiesInfo.smooth).toEqual(false);
    expect(result.current.mediaCapabilitiesInfo.powerEfficient).toEqual(true);
  });

  test('should return hasMediaDecodingConfig flag when no config given', () => {
    Object.defineProperty(window.navigator, 'mediaCapabilities', {
      value: true,
      configurable: true,
      writable: true
    });
    const { useMediaCapabilitiesDecodingInfo } = require('./');
    const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo());
    
    expect(result.current.mediaCapabilitiesInfo).toEqual({hasMediaDecodingConfig: false, supported: true});
  });
  
  test('should return MediaCapabilitiesInfo for given media configuration', () => {
    Object.defineProperty(window.navigator, 'mediaCapabilities', {
      value: {
        decodingInfo: mediaDecodingConfig => mediaCapabilitiesMapper[mediaDecodingConfig.audio.contentType]
      },
      configurable: true,
      writable: true
    });
    const { useMediaCapabilitiesDecodingInfo } = require('./');
    const { result } = renderHook(() => useMediaCapabilitiesDecodingInfo(mediaDecodingConfig));

    expect(result.current.mediaCapabilitiesInfo).toEqual({
      powerEfficient: true,
      smooth: true,
      supported: true
    });
  });
});
