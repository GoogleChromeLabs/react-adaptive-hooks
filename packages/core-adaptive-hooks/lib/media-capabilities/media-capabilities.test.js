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

import 'babel-polyfill';

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
  test('should return {} on unsupported platforms', async () => {
    const { useCoreMediaCapabilitiesDecodingInfo } = require('./');

    const result = await useCoreMediaCapabilitiesDecodingInfo();

    expect(result).toStrictEqual({});
  });

  test('should return {} on unsupported platforms with config given', async () => {
    const { useCoreMediaCapabilitiesDecodingInfo } = require('./');
    const result = await useCoreMediaCapabilitiesDecodingInfo(mediaDecodingConfig);

    expect(result).toStrictEqual({});
  });

  test('should return mediaCapabilitiesInfo for given media configuration', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    const mockDecodingInfo = jest.fn().mockImplementation(() => Promise.resolve({
      ...mediaCapabilitiesMapper[mediaDecodingConfig.audio.contentType]
    }));

    global.navigator.mediaCapabilities = {
      decodingInfo: mockDecodingInfo
    };

    const { useCoreMediaCapabilitiesDecodingInfo } = require('./');

    try {
      const result = await useCoreMediaCapabilitiesDecodingInfo(mediaDecodingConfig);

      expect(result.powerEfficient).toEqual(true);
      expect(result.smooth).toEqual(true);
      expect(result.supported).toEqual(true);
    } finally {
      console.error = originalError;
    }
  });
});
