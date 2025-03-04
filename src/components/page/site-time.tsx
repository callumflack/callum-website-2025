"use client";

import { format, toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";

export const SiteTime = () => {
  const hasMounted = useHasMounted();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Obtain a Date instance that will render the equivalent Cairns time for the UTC date, see: https://date-fns.org/v2.29.3/docs/Time-Zones
    const zonedDate = toZonedTime(new Date(), "Australia/Brisbane");

    // Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
    // const pattern = "d.M.yyyy HH:mm:ss.SSS 'GMT' XXX (z)";
    // const output = format(zonedDate, pattern, { timeZone: "Europe/Berlin" });
    const timer = setInterval(() => {
      setDate(zonedDate);
    }, 1000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  // See: https://date-fns.org/v2.23.0/docs/format
  const timeZone = "Australia/Brisbane";

  // const time = format(date, "hh:mm bbb (z)", { timeZone });
  const time = format(date, "HH:mm (z)", { timeZone });

  // <p className="text-meta !not-italic text-solid">
  return <>{hasMounted ? `Cairns, Australia ${time}` : null}</>;
};
