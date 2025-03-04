"use client";

import { useEffect } from "react";

interface BodyClassProviderProps {
  className: string;
  condition?: boolean;
  children: React.ReactNode;
}

export const BodyClassProvider: React.FC<BodyClassProviderProps> = ({
  className,
  condition = true,
  children,
}) => {
  useEffect(() => {
    if (condition) {
      const classes = className.split(" ");
      classes.forEach((cls) => document.body.classList.add(cls));

      return () => {
        classes.forEach((cls) => document.body.classList.remove(cls));
      };
    }
  }, [className, condition]);

  return <>{children}</>;
};
