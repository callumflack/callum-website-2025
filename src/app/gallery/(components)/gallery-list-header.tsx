"use client";

import { Button } from "@/components/atoms";
import { ListHeader } from "@/components/page";
import { ViewMode } from "@/types/viewMode";
import { SizeIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ListHeadingProps {
  // posts: Post[];
  topic?: string; // Make optional since feed page doesn't need it
  initialShow?: ViewMode;
  routePrefix: string; // Add route prefix for navigation
  listHeaderNode?: React.ReactNode; // only used in [topic] pages ATM
}

export const GalleryListHeader = ({
  topic,
  initialShow = "index",
  routePrefix,
  listHeaderNode,
}: ListHeadingProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showParam = (searchParams.get("show") as ViewMode) || initialShow;
  const [showInFull, setShowInFull] = useState(showParam === "full");

  const updateShowMode = (show: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("show", show);
    // Use the provided routePrefix for navigation
    const path = topic ? `${routePrefix}/${topic}` : routePrefix;
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <>
      <ListHeader
        showContained
        rhsNode={
          <div className="flex items-center gap-[2px]">
            <Button
              title="Enlarge"
              variant="icon"
              onClick={() => {
                setShowInFull(true);
                updateShowMode("full");
              }}
              className={showInFull ? "bg-background-hover text-fill" : ""}
            >
              <SizeIcon className="size-em" />
            </Button>
            {/* <Button
              title="Index"
              variant="icon"
              onClick={() => {
                setShowInFull(false);
                updateShowMode("index");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={!showInFull ? "bg-background-hover text-fill" : ""}
            >
              <ListBulletIcon className="size-em" />
            </Button> */}
          </div>
        }
      >
        {listHeaderNode ? (
          listHeaderNode
        ) : (
          /* retain consistent height! */
          <div className="h-tab w-px">&nbsp;</div>
        )}
      </ListHeader>

      {/* {showInFull ? "HEY" : "HO!"} */}
    </>
  );
};
