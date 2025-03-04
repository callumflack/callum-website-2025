"use client";

import { useCallback, useEffect, useState } from "react";

interface DeviceDetect {
  isMobileUserAgent: boolean;
  isMobileViewport: boolean;
}

const useDeviceDetect = (): DeviceDetect => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const deviceProperties = detectDevice(userAgent);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const onWindowSizeChanged = useCallback(() => {
    setIsMobileViewport(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    onWindowSizeChanged();
    window.addEventListener("resize", onWindowSizeChanged, true);

    return () => {
      window.removeEventListener("resize", onWindowSizeChanged, true);
    };
  }, [onWindowSizeChanged]);

  return {
    isMobileViewport,
    isMobileUserAgent: deviceProperties.isMobile(),
  } as DeviceDetect;
};

const detectDevice = (userAgent: string) => {
  const isAndroid = (): boolean => Boolean(/Android/i.exec(userAgent));
  const isIos = (): boolean => Boolean(/iPhone|iPad|iPod/i.exec(userAgent));
  const isOpera = (): boolean => Boolean(/Opera Mini/i.exec(userAgent));
  const isWindows = (): boolean => Boolean(/IEMobile/i.exec(userAgent));
  const isSSR = (): boolean => Boolean(/SSR/i.exec(userAgent));

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
};

export { useDeviceDetect };
