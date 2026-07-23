"use client";

import type { Post } from "content-collections";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent } from "react";
import {
  focusVisibleOutlineStyle,
  Link,
  textVariants,
} from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { ListHeader } from "@/components/page";
import { PostLine, sortButtonStyle } from "@/components/post";
import { cn } from "@/lib/utils";

type HomeView = "start" | "chrono";

export function HomeIndex({
  startHerePosts,
  chronologicalPosts,
}: {
  startHerePosts: Post[];
  chronologicalPosts: Post[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeView: HomeView =
    searchParams.get("view") === "chrono" ? "chrono" : "start";

  const setActiveView = (view: HomeView) => {
    const params = new URLSearchParams(searchParams.toString());

    if (view === "start") {
      params.delete("view");
    } else {
      params.set("view", view);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const moveToTab = (
    event: KeyboardEvent<HTMLButtonElement>,
    view: HomeView,
    tabId: string
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    setActiveView(view);
    requestAnimationFrame(() => document.getElementById(tabId)?.focus());
  };

  return (
    <section aria-label="Home index">
      <ListHeader
        ariaLabel="Home sections"
        rhsNode={
          <div className="flex items-center">
            {/* TODO: Once the long-form, Jenny Wen-style work story exists,
                reserve "Work overview" and /work for it, then move this project
                index to /projects. Until then, label the link for today's target. */}
            <LinkWithArrow
              className={cn(
                sortButtonStyle,
                "text-solid gap-1!",
                focusVisibleOutlineStyle
              )}
              href="/work"
            >
              Projects
            </LinkWithArrow>
            <LinkWithArrow
              className={cn(
                sortButtonStyle,
                "text-solid gap-1! pr-0",
                focusVisibleOutlineStyle
              )}
              href="/writing"
            >
              Writing
            </LinkWithArrow>
          </div>
        }
      >
        <div aria-label="Choose an index view" className="flex" role="tablist">
          <HomeTab
            controls="home-panel-start"
            isActive={activeView === "start"}
            label="Start here"
            onKeyDown={(event) => moveToTab(event, "chrono", "home-tab-chrono")}
            onSelect={() => setActiveView("start")}
            tabId="home-tab-start"
          />
          <HomeTab
            controls="home-panel-chrono"
            isActive={activeView === "chrono"}
            label="Chrono"
            onKeyDown={(event) => moveToTab(event, "start", "home-tab-start")}
            onSelect={() => setActiveView("chrono")}
            tabId="home-tab-chrono"
          />
        </div>
      </ListHeader>

      <HomePanel
        isActive={activeView === "start"}
        labelledBy="home-tab-start"
        panelId="home-panel-start"
        posts={startHerePosts}
      />

      <HomePanel
        isActive={activeView === "chrono"}
        labelledBy="home-tab-chrono"
        panelId="home-panel-chrono"
        posts={chronologicalPosts}
      >
        <IndexFooter href="/log">View full log</IndexFooter>
      </HomePanel>
    </section>
  );
}

function HomeTab({
  controls,
  isActive,
  label,
  onKeyDown,
  onSelect,
  tabId,
}: {
  controls: string;
  isActive: boolean;
  label: string;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onSelect: () => void;
  tabId: string;
}) {
  return (
    <button
      aria-controls={controls}
      aria-selected={isActive}
      className={cn(
        sortButtonStyle,
        isActive ? "border-b-fill! text-fill" : "text-solid",
        focusVisibleOutlineStyle
      )}
      id={tabId}
      onKeyDown={onKeyDown}
      onClick={onSelect}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      {label}
    </button>
  );
}

function HomePanel({
  children,
  isActive,
  labelledBy,
  panelId,
  posts,
}: {
  children?: React.ReactNode;
  isActive: boolean;
  labelledBy: string;
  panelId: string;
  posts: Post[];
}) {
  return (
    <div
      aria-labelledby={labelledBy}
      hidden={!isActive}
      id={panelId}
      role="tabpanel"
    >
      <div className="pt-3">
        {posts.map((post) => (
          <IndexRow key={post.slug} post={post} />
        ))}
      </div>
      {children}
    </div>
  );
}

function IndexRow({ post }: { post: Post }) {
  return (
    <Link
      className={cn(
        "group relative z-0 block",
        "focus-visible:before:bg-background-hover focus-visible:before:absolute focus-visible:before:inset-y-0 focus-visible:before:-inset-x-3 focus-visible:before:-z-[1] focus-visible:before:content-['']",
        focusVisibleOutlineStyle
      )}
      href={post.thumbnailLink ?? `/${post.slug}`}
      data-slot="index-row"
    >
      <PostLine categoryStyle="plain" dateFormat="year" isFeed post={post} />
    </Link>
  );
}

function IndexFooter({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <div className="pt-gap flex justify-end">
      <LinkWithArrow
        className={cn(
          textVariants({ intent: "meta", weight: "medium", color: "solid" }),
          "hover:text-fill inline-flex min-h-10 items-center gap-1",
          focusVisibleOutlineStyle
        )}
        href={href}
      >
        {children}
      </LinkWithArrow>
    </div>
  );
}
