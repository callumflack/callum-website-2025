"use client";

import { format, toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";

export const SiteTime = () => {
  const hasMounted = useHasMounted();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      // Compute fresh zoned date on each tick
      setDate(toZonedTime(new Date(), "Australia/Brisbane"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // See: https://date-fns.org/v2.23.0/docs/format
  const timeZone = "Australia/Brisbane";

  // const time = format(date, "hh:mm bbb (z)", { timeZone });
  const time = format(date, "HH:mm (z)", { timeZone });

  // <p className="text-meta !not-italic text-solid">
  return <>{hasMounted ? `Cairns, Australia ${time}` : null}</>;
};
