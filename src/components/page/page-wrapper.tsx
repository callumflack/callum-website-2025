"use client";

import { cx } from "cva";
import { RefObject, useRef, useEffect } from "react";
import { useIntersection } from "react-use";
import { OutsetRule } from "../elements/outset-rule";
import { Nav } from "./nav";
export const PageWrapper = ({
  activeNav,
  children,
  footerChildren,
}: {
  activeNav?: string;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
}) => {
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    intersectionRef as RefObject<HTMLElement>,
    {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    }
  );

  useEffect(() => {
    document.body.classList.toggle(
      "bg-panel",
      (intersection?.intersectionRatio ?? 0) === 1
    );
  }, [intersection?.intersectionRatio]);

  return (
    <>
      <Nav
        activeNav={activeNav}
        anchorName="Callum"
        navItems={[
          // { href: "/about", label: "About" },
          // { href: "/work", label: "Work" },
          // { href: "/writing", label: "Writing" },
          // { href: "/graphics", label: "GxIx" },
          // { href: config.PUBLIC_NOTES_URL, label: "Notes" },
          { href: "/index", label: "Index" },
          { href: "/work", label: "Work" },
          { href: "/notes", label: "Notes" },
          { href: "/about", label: "About" },
        ]}
        className={cx(
          intersection && intersection.intersectionRatio < 1 ? "" : "!bg-panel"
        )}
        ruleClassName={cx(
          intersection && intersection.intersectionRatio < 1
            ? "border-border"
            : "border-solid"
        )}
      />

      {/* container max-w-(--container-hero-inset) */}
      <div className="pt-w12 space-y-w6">{children}</div>

      {/* relative z-20 */}
      <OutsetRule wrapperClassName="" />
      {/* This ensure tailwind renders the bg-panel class */}
      <div className="bg-panel hidden h-px"></div>
      <footer
        className={cx(
          "pt-w16 relative container",
          "flex flex-col justify-between",
          "min-h-[calc(100dvh-var(--spacing-nav)-1px)]"
        )}
      >
        {footerChildren}
        {intersectionRef ? (
          <div
            className="bg-panel absolute bottom-0 h-px"
            ref={intersectionRef}
          />
        ) : null}
      </footer>
    </>
  );
};
