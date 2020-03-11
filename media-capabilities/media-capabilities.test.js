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

import { useMediaCapabilities } from './';

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
    const { result } = renderHook(() => useMediaCapabilities(mediaConfig));

    expect(result.current.mediaCapabilities).toEqual({hasMediaConfig: true, supported: false});
  });

  test('should return supported and hasMediaConfig flags on unsupported platforms and no config given', () => {
    const { result } = renderHook(() => useMediaCapabilities());
    
    expect(result.current.mediaCapabilities).toEqual({hasMediaConfig: false, supported: false});
  });

  test('should return initialMediaCapabilities for unsupported', () => {
    const initialMediaCapabilities = {
      supported: true,
      smooth: false,
      powerEfficient: true
    };

    const { result } = renderHook(() => useMediaCapabilities(mediaConfig, initialMediaCapabilities));

    expect(result.current.mediaCapabilities.supported).toBe(true);
    expect(result.current.mediaCapabilities.smooth).toEqual(false);
    expect(result.current.mediaCapabilities.powerEfficient).toEqual(true);
  });

  test('should return hasMediaConfig flag when no config given', () => {
    Object.defineProperty(window.navigator, 'mediaCapabilities', {
      value: true,
      configurable: true,
      writable: true
    });

    const { result } = renderHook(() => useMediaCapabilities());
    
    expect(result.current.mediaCapabilities).toEqual({hasMediaConfig: false, supported: true});
  });
  
  test('should return MediaDecodingConfiguration for given media configuration', () => {
    Object.defineProperty(window.navigator, 'mediaCapabilities', {
      value: {
        decodingInfo: mediaConfig => mediaCapabilitiesMapper[mediaConfig.audio.contentType]
      },
      configurable: true,
      writable: true
    });

    const { result } = renderHook(() => useMediaCapabilities(mediaConfig));

    expect(result.current.mediaCapabilities).toEqual({
      powerEfficient: true,
      smooth: true,
      supported: true
    });
  });
});
