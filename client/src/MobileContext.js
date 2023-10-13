import { createContext, useEffect, useState, useContext } from 'react';

export const DeviceContext = createContext();

export const useDeviceContext = () => useContext(DeviceContext);

export function DeviceProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const mobileUserAgents = [
      'Android',
      'webOS',
      'iPhone',
      'iPad',
      'iPod',
      'BlackBerry',
      'Windows Phone',
    ];

    const isMobileDevice = mobileUserAgents.some((agent) => {
      return userAgent.includes(agent);
    });

    setIsMobile(isMobileDevice);
  }, []);

  return (
    <DeviceContext.Provider value={isMobile}>{children}</DeviceContext.Provider>
  );
}
