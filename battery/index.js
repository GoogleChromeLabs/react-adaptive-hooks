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

export const unsupportMessage = 'The Battery Status API is not supported on this platform.';

const useBatteryStatus = () => {
  const [batteryStatus, setBatteryStatus] = useState(null);

  const monitorBattery = battery => {
    // Update the initial UI
    updateBatteryStatus(battery);
  
    // Monitor for futher updates
    battery.addEventListener('levelchange', updateBatteryStatus.bind(null, battery));
    battery.addEventListener('chargingchange', updateBatteryStatus.bind(null, battery));
    battery.addEventListener('dischargingtimechange', updateBatteryStatus.bind(null, battery));
    battery.addEventListener('chargingtimechange', updateBatteryStatus.bind(null, battery));
  };

  const updateBatteryStatus = battery => {
    setBatteryStatus({
      chargingTime: `${battery.chargingTime} Seconds`,
      dischargeTime: `${battery.dischargingTime} Seconds`,
      level: battery.level,
      chargingState: battery.charging === true ? 'Charging' : 'Discharging'
    });
  };

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(monitorBattery);
    } else {
      setBatteryStatus({unsupportMessage});
    }
  // eslint-disable-next-line
  }, []);

  return { batteryStatus, updateBatteryStatus, monitorBattery };
};

export { useBatteryStatus };
