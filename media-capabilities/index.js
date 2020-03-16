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
import { useState, useEffect } from 'react';

const supported = typeof window !== 'undefined' && 'mediaCapabilities' in navigator;

const useMediaCapabilities = (mediaConfig, initialMediaCapabilities = {}) => {
  initialMediaCapabilities = {
    supported,
    ...initialMediaCapabilities
  };

  const [mediaCapabilities, setMediaCapabilities] = useState(initialMediaCapabilities);

  const updateMediaCapabilities = mediaCapabilities => {
    setMediaCapabilities(mediaCapabilities);
  };

  useEffect(() => {
    if (supported && !!mediaConfig) {
      navigator
        .mediaCapabilities
        .decodingInfo(mediaConfig)
        .then(updateMediaCapabilities);
    }
  })

  return {
    ...mediaCapabilities,
    updateMediaCapabilities
  };
};

export { useMediaCapabilities };
