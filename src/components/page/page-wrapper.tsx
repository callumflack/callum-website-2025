"use client";

// import { cx } from "cva";
// import { useRef } from "react";
// import { useIntersection } from "react-use";
// import config from "@/config";
// import { Nav, FooterShape } from "@repo/ui/page";
// import { TitleHeader } from "@repo/ui/elements";
// import { Signoff } from "~/src/components/elements/signoff";
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
  // const intersectionRef = useRef(null);
  // const intersection = useIntersection(intersectionRef, {
  //   root: null,
  //   rootMargin: "0px",
  //   threshold: 1,
  // });

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
          { href: "/about", label: "About" },
        ]}
        // ruleClassName={cx(
        //   intersection && intersection.intersectionRatio < 1
        //     ? "border-border"
        //     : "!border-transparent"
        // )}
      />

      {children}

      {footerChildren}
      {/* <FooterShape intersectionRef={intersectionRef}>
        <TitleHeader as="div" isContainedChild>
          <Signoff />
        </TitleHeader>
        {footerChildren}
      </FooterShape> */}
    </>
  );
};
