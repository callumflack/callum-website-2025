"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { KeyboardEvent, ReactNode } from "react";
import { focusVisibleOutlineStyle, Link } from "@/components/atoms";
import { LinkWithArrow } from "@/components/elements";
import { Mdx } from "@/components/mdx";
import { IndexFooter, ListHeader } from "@/components/page";
import { ListModeButton, PostLine, sortButtonStyle } from "@/components/post";
import { cn } from "@/lib/utils";
import type { PostListItem } from "@/types/content";

type HomeView = "start" | "recent";

/** Flip to true to restore the Recent tab + `?view=recent` panel. */
const SHOW_RECENT_TAB = false;

export function HomeIndex({
  homeContent,
  recentPosts,
}: {
  homeContent: string;
  recentPosts: PostListItem[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView: HomeView =
    SHOW_RECENT_TAB && searchParams.get("view") === "recent"
      ? "recent"
      : "start";

  const setActiveView = (view: HomeView) => {
    if (!SHOW_RECENT_TAB && view === "recent") return;
    if (view === activeView) return;

    const params = new URLSearchParams(searchParams.toString());

    if (view === "start") {
      params.delete("view");
    } else {
      params.set("view", view);
    }

    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      query ? `${pathname}?${query}` : pathname
    );
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
    <section aria-label="Home index" data-component="HomeIndex">
      {/* <div className="container">
        <ListHeader
          ariaLabel="Home sections"
          rhsNode={
            <div className="flex items-center">
              <HomeIndexLink href="/work">Projects</HomeIndexLink>
              <HomeIndexLink href="/writing">Writing</HomeIndexLink>
              <HomeIndexLink className="pr-0" href="/about">
                About
              </HomeIndexLink>
            </div>
          }
        >
          <div aria-label="Choose a home view" className="flex" role="tablist">
            <HomeTab
              controls="home-panel-start"
              isActive={activeView === "start"}
              label="Start here"
              onKeyDown={(event) =>
                moveToTab(event, "recent", "home-tab-recent")
              }
              onSelect={() => setActiveView("start")}
              tabId="home-tab-start"
            />
            {SHOW_RECENT_TAB ? (
              <HomeTab
                controls="home-panel-recent"
                isActive={activeView === "recent"}
                label="Recent"
                onKeyDown={(event) =>
                  moveToTab(event, "start", "home-tab-start")
                }
                onSelect={() => setActiveView("recent")}
                tabId="home-tab-recent"
              />
            ) : null}
          </div>
        </ListHeader>
      </div> */}

      <HomePanel
        isActive={activeView === "start"}
        labelledBy="home-tab-start"
        panelId="home-panel-start"
      >
        <div className={cn(activeView === "start" ? "pt-small" : "pt-3")}>
          <Mdx
            className={activeView === "start" ? "Prose--homeStart" : undefined}
            code={homeContent}
          />
        </div>
      </HomePanel>

      {SHOW_RECENT_TAB ? (
        <HomePanel
          isActive={activeView === "recent"}
          labelledBy="home-tab-recent"
          panelId="home-panel-recent"
        >
          <main className="container pt-3">
            {recentPosts.map((post) => (
              <IndexRow key={post.slug} post={post} />
            ))}
            <IndexFooter href="/log">View full log</IndexFooter>
          </main>
        </HomePanel>
      ) : null}
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
    <ListModeButton
      aria-controls={controls}
      aria-selected={isActive}
      className={focusVisibleOutlineStyle}
      id={tabId}
      isActive={isActive}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      role="tab"
      tabIndex={isActive ? 0 : -1}
    >
      {label}
    </ListModeButton>
  );
}

function HomePanel({
  children,
  isActive,
  labelledBy,
  panelId,
}: {
  children: ReactNode;
  isActive: boolean;
  labelledBy: string;
  panelId: string;
}) {
  return (
    <div
      aria-labelledby={labelledBy}
      hidden={!isActive}
      id={panelId}
      role="tabpanel"
    >
      {children}
    </div>
  );
}

function IndexRow({ post }: { post: PostListItem }) {
  return (
    <Link
      className={cn(
        "group relative z-0 block",
        "focus-visible:before:bg-background-hover focus-visible:before:absolute focus-visible:before:-inset-x-3 focus-visible:before:inset-y-0 focus-visible:before:-z-[1] focus-visible:before:content-['']",
        focusVisibleOutlineStyle
      )}
      data-slot="index-row"
      href={post.thumbnailLink ?? `/${post.slug}`}
    >
      <PostLine categoryStyle="plain" dateFormat="year" isFeed post={post} />
    </Link>
  );
}

function HomeIndexLink({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <LinkWithArrow
      className={cn(
        sortButtonStyle,
        "text-solid gap-1!",
        focusVisibleOutlineStyle,
        className
      )}
      href={href}
    >
      {children}
    </LinkWithArrow>
  );
}
