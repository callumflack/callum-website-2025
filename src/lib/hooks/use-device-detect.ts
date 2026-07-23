"use client";

import { useSyncExternalStore } from "react";

interface DeviceDetect {
  isMobileUserAgent: boolean;
  isMobileViewport: boolean;
}

const subscribeToResize = (callback: () => void) => {
  window.addEventListener("resize", callback, true);
  return () => window.removeEventListener("resize", callback, true);
};

export const useDeviceDetect = (): DeviceDetect => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const deviceProperties = detectDevice(userAgent);
  const isMobileViewport = useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth < 640,
    () => false
  );

  return {
    isMobileViewport,
    isMobileUserAgent: deviceProperties.isMobile(),
  };
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
