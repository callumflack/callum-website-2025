"use client";

/**

  Client component for copying URLs to clipboard.

  NOTE: In Next.js app router, this component CANNOT be directly imported by server components. Instead, it must be wrapped by a client boundary component (see share-button-wrapper.tsx).

  This is due to Next.js component model which prevents passing functions/complex objects between server and client component boundaries. Even with "use client", the way components import each other creates dependencies that affect serialization.
 */

import { Button } from "@/components/atoms";
import { Link1Icon, Link2Icon } from "@radix-ui/react-icons";
import { cx } from "cva";
import { CopyButton } from "./copy-button";

export type ShareButtonProps = {
  url?: string;
  theme?: "post" | "feed";
};

export const ShareButton = ({ url, theme = "post" }: ShareButtonProps) => {
  return (
    <CopyButton
      valueToCopy={url || ""}
      confirmationMessage="URL copied!"
      className={cx(theme === "post" && "-ml-0.5")}
    >
      <Button
        variant={theme === "post" ? "outline" : "pill"}
        size={theme === "post" ? "sm" : "reset"}
        className={
          theme === "post"
            ? ""
            : "hover:text-fill hover:border-fill! border-transparent! [&_svg]:size-[1.3em] [&_svg]:translate-y-[0.05em] [&_svg]:transform"
        }
        PrefixIcon={theme === "post" ? <Link2Icon /> : <Link1Icon />}
      >
        Share
      </Button>
    </CopyButton>
  );
};
