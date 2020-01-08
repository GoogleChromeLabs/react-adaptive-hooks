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

import { useState, useEffect } from 'react';

let unsupported;


const useNetworkStatus = initialEffectiveConnectionType => {
  if (
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    'effectiveType' in navigator.connection
  ) {
    unsupported = false;
  } else {
    unsupported = true;
  }

  const getEffectiveConnectionType = () => {
    const isOnline = 'onLine' in navigator ? navigator.onLine : true;
    if (isOnline === false) {
      return 'offline';
    }
    return unsupported
      ? initialEffectiveConnectionType
      : navigator.connection.effectiveType;
  };

  const initialNetworkStatus = {
    unsupported,
    effectiveConnectionType: getEffectiveConnectionType(),
  };

  const [networkStatus, setNetworkStatus] = useState(initialNetworkStatus);

  useEffect(() => {
    if (!unsupported) {
      const navigatorConnection = navigator.connection;
      const updateECTStatus = () => {
        setNetworkStatus({
          effectiveConnectionType:
            'onLine' in navigator && navigator.onLine === false
              ? 'offline'
              : navigatorConnection.effectiveType,
        });
      };

      navigatorConnection.addEventListener('change', updateECTStatus);
      window.addEventListener('offline', updateECTStatus);
      
      return () => {
        navigatorConnection.removeEventListener('change', updateECTStatus);
        window.removeEventListener('offline', updateECTStatus);
      };
    }
  }, []);

  return { ...networkStatus, setNetworkStatus };
};


export { useNetworkStatus };
