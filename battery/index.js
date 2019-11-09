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

let unsupported;

const useBatteryStatus = () => {
  if ('getBattery' in navigator) {
    unsupported = false;
  } else {
    unsupported = true;
  }

  const initialBatteryStatus = !unsupported ? {
    chargingTime: null,
    dischargingTime: null,
    level: null,
    charging: null
  } : {
    unsupported
  };
  
  const [batteryStatus, setBatteryStatus] = useState(initialBatteryStatus);

  const updateBatteryStatus = battery => {
    setBatteryStatus({
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      level: battery.level,
      charging: battery.charging
    });
  };

  useEffect(() => {
    if (!unsupported) {
      const monitorBattery = battery => {
        // Update the initial UI
        updateBatteryStatus(battery);
      
        // Monitor for futher updates
        battery.addEventListener('levelchange', updateBatteryStatus.bind(null, battery));
        battery.addEventListener('chargingchange', updateBatteryStatus.bind(null, battery));
        battery.addEventListener('dischargingtimechange', updateBatteryStatus.bind(null, battery));
        battery.addEventListener('chargingtimechange', updateBatteryStatus.bind(null, battery));
      };

      navigator.getBattery().then(monitorBattery);
    }
  }, []);

  return { ...batteryStatus, updateBatteryStatus };
};

export { useBatteryStatus };
