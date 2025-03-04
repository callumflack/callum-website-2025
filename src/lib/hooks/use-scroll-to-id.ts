import { useCallback } from "react";

export const useSmoothScrollTo = () => {
  const scrollToId = useCallback((id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return scrollToId;
};
