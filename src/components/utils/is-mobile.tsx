import { useEffect, useState } from "react";

/*
`use-device-detect.ts` is better than this because it:

1. Provides device-specific detection (Android/iOS/etc)
2. Separates viewport size and user agent detection
3. Handles SSR properly
4. Gives more granular control with multiple detection points

The `is-mobile.tsx` only checks touch capability, which isn't reliable (many laptops have touch screens).
*/

let isMobileValue: null | boolean = null;
function isMobile(): boolean {
  // When rendering on the server, return false and do not cache the value.
  if (typeof window === "undefined") {
    return false;
  }

  if (isMobileValue === null) {
    const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
    if ("ontouchstart" in window) {
      isMobileValue = true;
    } else {
      const query = [
        "(",
        prefixes.join("touch-enabled),("),
        "heartz",
        ")",
      ].join("");
      isMobileValue = window.matchMedia(query).matches;
    }
  }
  return isMobileValue;
}

export function useIsMobile(): boolean {
  const [localMobileValue, setLocalMobileValue] = useState(
    isMobileValue ?? false
  );

  useEffect(() => {
    setLocalMobileValue(isMobile());
  }, []);

  return localMobileValue;
}

export default isMobile;
