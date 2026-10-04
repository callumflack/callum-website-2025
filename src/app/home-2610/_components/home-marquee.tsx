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

export function HomeMarquee({ slides }: { slides: HomeSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stoppedRef = useRef(false);

  function stop() {
    stoppedRef.current = true;
    if (trackRef.current) trackRef.current.dataset.motion = "stopped";
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(width < 660px)");
    let pointer: { x: number; y: number } | null = null;
    let activeVideo: HTMLVideoElement | null = null;
    let playbackFrame = 0;

    const findSlide = (element: Element | null) => {
      const slide = element?.closest<HTMLElement>(
        '[data-slot="home-marquee-slide"]'
      );
      return slide && track.contains(slide) ? slide : null;
    };
    const findCenteredSlide = () => {
      const rect = track.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return null;
      const center = rect.left + rect.width / 2;
      for (const slide of track.children) {
        const bounds = slide.getBoundingClientRect();
        if (Math.abs(bounds.left + bounds.width / 2 - center) < 1) return slide;
      }
      return null;
    };
    const updatePlayback = () => {
      cancelAnimationFrame(playbackFrame);
      playbackFrame = 0;
      // Scroll can move a new slide under an unmoving pointer without sending
      // pointerenter/leave. Hit-test the current layout instead of those events.
      const hovered = pointer
        ? findSlide(document.elementFromPoint(pointer.x, pointer.y))
        : null;
      const focused = findSlide(document.activeElement);
      // Native mobile snapping chooses the position; we only follow it for
      // playback, after interaction has permanently stopped the marquee.
      const slide = mobileViewport.matches
        ? track.dataset.browsing === "true"
          ? findCenteredSlide()
          : focused
        : (hovered ?? focused);
      if (slide) stop();
      const video = slide?.querySelector("video") ?? null;
      if (video === activeVideo) return;
      activeVideo?.pause();
      activeVideo = video;
      void activeVideo?.play().catch(() => {});
    };
    const schedulePlayback = () => {
      if (!playbackFrame) playbackFrame = requestAnimationFrame(updatePlayback);
    };
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      updatePlayback();
    };
    const handlePointerLeave = () => {
      pointer = null;
      updatePlayback();
    };
    const beginBrowsing = () => {
      stop();
      track.dataset.browsing = "true";
      track.dataset.snap = mobileViewport.matches ? "center" : "none";
      schedulePlayback();
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
      if (mobileViewport.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      schedulePlayback();

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
    track.addEventListener("pointerdown", beginBrowsing);
    track.addEventListener("keydown", handleKeyDown);
    track.addEventListener("pointerenter", handlePointer);
    track.addEventListener("pointermove", handlePointer);
    track.addEventListener("pointerleave", handlePointerLeave);
    track.addEventListener("focusin", updatePlayback);
    track.addEventListener("focusout", schedulePlayback);
    // Observe both strip scrolling and page scrolling beneath a fixed pointer.
    window.addEventListener("scroll", schedulePlayback, {
      capture: true,
      passive: true,
    });

    const respectReducedMotion = () => {
      if (reducedMotion.matches) stop();
    };
    respectReducedMotion();
    reducedMotion.addEventListener("change", respectReducedMotion);

    let frame = 0;
    let previousTime: number | undefined;
    let position = track.scrollLeft;
    let cycleWidth = 0;

    const measure = () => {
      track.dataset.snap =
        mobileViewport.matches && track.dataset.browsing === "true"
          ? "center"
          : "none";
      schedulePlayback();
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
      cancelAnimationFrame(playbackFrame);
      activeVideo?.pause();
      observer.disconnect();
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("pointerdown", beginBrowsing);
      track.removeEventListener("keydown", handleKeyDown);
      track.removeEventListener("pointerenter", handlePointer);
      track.removeEventListener("pointermove", handlePointer);
      track.removeEventListener("pointerleave", handlePointerLeave);
      track.removeEventListener("focusin", updatePlayback);
      track.removeEventListener("focusout", schedulePlayback);
      window.removeEventListener("scroll", schedulePlayback, true);
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
