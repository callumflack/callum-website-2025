"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { focusVisibleOutlineStyle } from "@/components/atoms";
import {
  getDimensions,
  isVideoFile,
  parseAspectRatio,
} from "@/components/media/media-utils";
import { ProjectStripCaption } from "@/components/media/project-strip-item";
import { Video } from "@/components/media/video";
import { cn } from "@/lib/utils";
import styles from "../home.module.css";
import type { HomeSlide } from "./slides";

const SPEED = 20; // Pixels per second, independent of refresh rate.
const SNAP_DURATION = 1200; // Roughly four times the previous native snap.

export function HomeMarquee({ slides }: { slides: HomeSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stoppedRef = useRef(false);

  function stop() {
    stoppedRef.current = true;
    if (trackRef.current) trackRef.current.dataset.motion = "stopped";
  }

  function play(figure: HTMLElement) {
    stop();
    void figure
      .querySelector("video")
      ?.play()
      .catch(() => {});
  }

  function pause(figure: HTMLElement) {
    figure.querySelector("video")?.pause();
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    let snapFrame = 0;
    let touchActive = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const cancelSnap = () => {
      cancelAnimationFrame(snapFrame);
      snapFrame = 0;
    };

    const snapToCenter = () => {
      const start = track.scrollLeft;
      const trackCenter =
        track.getBoundingClientRect().left + track.clientWidth / 2;
      let distance = Infinity;
      for (const slide of track.children) {
        const rect = slide.getBoundingClientRect();
        const candidate = rect.left + rect.width / 2 - trackCenter;
        if (Math.abs(candidate) < Math.abs(distance)) distance = candidate;
      }

      // Match proximity snapping: leave distant resting positions alone.
      if (
        !Number.isFinite(distance) ||
        Math.abs(distance) > track.clientWidth * 0.3
      ) {
        return;
      }
      const target = Math.max(
        0,
        Math.min(start + distance, track.scrollWidth - track.clientWidth)
      );
      if (reducedMotion.matches || Math.abs(target - start) < 1) {
        track.scrollLeft = target;
        track.dataset.snap = "center";
        return;
      }

      track.dataset.snap = "animating";
      const startedAt = performance.now();
      const glide = (time: number) => {
        const progress = Math.min((time - startedAt) / SNAP_DURATION, 1);
        const eased = 1 - (1 - progress) ** 3;
        track.scrollLeft = start + (target - start) * eased;
        if (progress < 1) {
          snapFrame = requestAnimationFrame(glide);
        } else {
          snapFrame = 0;
          track.dataset.snap = "center";
        }
      };
      snapFrame = requestAnimationFrame(glide);
    };

    const updateBrowsingInsets = () => {
      const first = track.firstElementChild as HTMLElement | null;
      const last = track.lastElementChild as HTMLElement | null;
      if (!first || !last) return;

      const previousInset = Number.parseFloat(
        getComputedStyle(track).paddingLeft
      );
      const previousPosition = track.scrollLeft;
      // Read the responsive text inset before supplying extra room to centre
      // the first/last slides. Offset scrollLeft so the visible slides stay put.
      track.style.removeProperty("padding-inline-start");
      track.style.removeProperty("padding-inline-end");
      const inset = Number.parseFloat(getComputedStyle(track).paddingLeft);
      const start = Math.max(
        inset,
        (track.clientWidth - first.offsetWidth) / 2
      );
      const end = Math.max(inset, (track.clientWidth - last.offsetWidth) / 2);
      track.style.paddingInlineStart = `${start}px`;
      track.style.paddingInlineEnd = `${end}px`;
      track.scrollLeft = previousPosition + start - previousInset;
    };

    const beginBrowsing = () => {
      stop();
      clearTimeout(snapTimer);
      cancelSnap();
      track.dataset.snap = "none";
      if (track.dataset.browsing !== "true") {
        track.dataset.browsing = "true";
        updateBrowsingInsets();
      }
    };

    const settleScroll = () => {
      if (track.dataset.browsing !== "true" || track.dataset.snap !== "none")
        return;
      clearTimeout(snapTimer);
      if (touchActive) return;
      snapTimer = setTimeout(snapToCenter, 160);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        if (snapFrame) beginBrowsing();
        return;
      }
      touchActive = true;
      beginBrowsing();
    };
    const handlePointerUp = () => {
      if (!touchActive) return;
      touchActive = false;
      settleScroll();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target === track &&
        ["ArrowLeft", "ArrowRight"].includes(event.key)
      )
        beginBrowsing();
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      beginBrowsing();
      settleScroll();

      // Leave horizontal trackpad gestures to the native scroll container.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (!event.cancelable) return;

      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? Number.parseFloat(getComputedStyle(track).lineHeight) || 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? track.clientWidth
            : 1;

      event.preventDefault();
      track.scrollLeft += event.deltaY * unit;
    };
    // Cancel vertical page scrolling only over this strip, never at the root.
    track.addEventListener("wheel", handleWheel, { passive: false });
    track.addEventListener("scroll", settleScroll, { passive: true });
    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointerup", handlePointerUp);
    track.addEventListener("pointercancel", handlePointerUp);
    track.addEventListener("keydown", handleKeyDown);

    const respectReducedMotion = () => {
      if (reducedMotion.matches) {
        stop();
        if (snapFrame) {
          cancelSnap();
          snapToCenter();
        }
      }
    };
    respectReducedMotion();
    reducedMotion.addEventListener("change", respectReducedMotion);

    let frame = 0;
    let previousTime: number | undefined;
    let position = track.scrollLeft;
    let cycleWidth = 0;

    const measure = () => {
      if (snapFrame) {
        cancelSnap();
        track.dataset.snap = "none";
        settleScroll();
      }
      if (track.dataset.browsing === "true") updateBrowsingInsets();
      const first = track.querySelector<HTMLElement>("[data-slide-copy='0']");
      const repeat = track.querySelector<HTMLElement>("[data-slide-copy='1']");
      if (first && repeat) cycleWidth = repeat.offsetLeft - first.offsetLeft;
      position = track.scrollLeft;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    measure();

    const animate = (time: number) => {
      if (stoppedRef.current) return;

      if (previousTime !== undefined && !document.hidden && cycleWidth > 0) {
        // Cap elapsed time so restoring a background tab cannot jump the strip.
        position =
          (position + (Math.min(time - previousTime, 64) * SPEED) / 1000) %
          cycleWidth;
        track.scrollLeft = position;
      }
      previousTime = time;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      cancelSnap();
      clearTimeout(snapTimer);
      observer.disconnect();
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("scroll", settleScroll);
      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointerup", handlePointerUp);
      track.removeEventListener("pointercancel", handlePointerUp);
      track.removeEventListener("keydown", handleKeyDown);
      reducedMotion.removeEventListener("change", respectReducedMotion);
    };
  }, []);

  return (
    <section
      className={styles.marquee}
      data-slot="home-marquee"
      aria-label="Selected work"
    >
      <div
        ref={trackRef}
        className={cn(styles.track, "hide-scrollbar", focusVisibleOutlineStyle)}
        data-slot="home-marquee-track"
        data-motion="running"
        data-snap="none"
        tabIndex={0}
        role="region"
        aria-label="Project slides; scroll horizontally to browse"
        onFocus={stop}
        onPointerDown={stop}
      >
        {[0, 1].flatMap((copy) =>
          slides.map(({ asset, style, ...project }, index) => {
            const { width, height } = getDimensions(asset.aspect);

            return (
              <figure
                key={`${copy}-${index}-${project.slug}`}
                className={styles.slide}
                data-slot="home-marquee-slide"
                data-slide-copy={copy}
                aria-hidden={copy === 1 ? true : undefined}
                style={
                  {
                    "--slide-aspect": parseAspectRatio(asset.aspect),
                    ...style,
                  } as CSSProperties
                }
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") play(event.currentTarget);
                }}
                onPointerLeave={(event) => {
                  if (!event.currentTarget.contains(document.activeElement))
                    pause(event.currentTarget);
                }}
                onFocus={(event) => play(event.currentTarget)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    pause(event.currentTarget);
                }}
              >
                <ProjectStripCaption
                  {...project}
                  tabIndex={copy === 1 ? -1 : undefined}
                />
                <div
                  className={cn(styles.panel, "bg-project-panel")}
                  data-slot="home-marquee-panel"
                >
                  <div className={styles.media} data-slot="home-marquee-media">
                    {isVideoFile(asset.src) ? (
                      <Video
                        src={asset.src}
                        poster={asset.poster ?? ""}
                        aspect={asset.aspect}
                        className="h-full w-full object-contain"
                        autoPlay={false}
                        muted
                        preload="auto"
                        posterPriority={copy === 0 && index < 2}
                        aria-label={asset.alt}
                      />
                    ) : (
                      <Image
                        src={asset.src}
                        alt={asset.alt}
                        width={width}
                        height={height}
                        sizes="(max-width: 660px) 700px, 1200px"
                        className="h-full w-full object-contain"
                        loading={copy === 0 && index < 2 ? "eager" : "lazy"}
                        draggable={false}
                      />
                    )}
                  </div>
                </div>
              </figure>
            );
          })
        )}
      </div>
    </section>
  );
}
