"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { focusVisibleOutlineStyle, Link } from "@/components/atoms";
import { Video } from "@/components/media";
import {
  getImageDimensions,
  isVideoFile,
} from "@/components/media/media-utils";
import { cn } from "@/lib/utils";
import type { Asset } from "@/types/content";
import { mdxMediaSpacing } from "./mdx-media";
import { StoryPostMeta } from "./story-post-meta";

export interface ProjectHeroCarouselSlide {
  asset: Asset;
  href: string;
  id: string;
  title: string;
  yearSpan: string;
}

// const RAIL_MEDIA_HEIGHT = "h-[clamp(160px,34vw,220px)]";
const RAIL_MEDIA_HEIGHT = "h-[180px]";

interface ProjectHeroCarouselClientProps {
  label: string;
  slides: readonly ProjectHeroCarouselSlide[];
}

const SWIPE_THRESHOLD = 52;
const SCROLL_EDGE_PX = 1;

function getRailOverflow(node: HTMLDivElement) {
  const maxScroll = node.scrollWidth - node.clientWidth;

  return {
    left: node.scrollLeft > SCROLL_EDGE_PX,
    right: maxScroll - node.scrollLeft > SCROLL_EDGE_PX,
  };
}

function SlideMedia({
  className,
  priority,
  sizes,
  slide,
}: {
  className?: string;
  priority?: boolean;
  sizes: string;
  slide: ProjectHeroCarouselSlide;
}) {
  const { alt, aspect, poster, src } = slide.asset;

  if (isVideoFile(src)) {
    return (
      <div className="h-full w-full [&>div]:h-full [&>div]:w-full">
        <Video
          aspect={aspect}
          className={cn("h-full w-full", className)}
          poster={poster ?? ""}
          src={src}
        />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      draggable={false}
      fill
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}

export function ProjectHeroCarouselClient({
  label,
  slides,
}: ProjectHeroCarouselClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [railOverflow, setRailOverflow] = useState({
    left: false,
    right: slides.length > 1,
  });
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const count = slides.length;
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const node = railRef.current;

    if (!node) {
      return;
    }

    const syncOverflow = () => {
      const next = getRailOverflow(node);
      setRailOverflow((prev) =>
        prev.left === next.left && prev.right === next.right ? prev : next
      );
    };

    syncOverflow();

    const observer = new ResizeObserver(syncOverflow);
    observer.observe(node);
    for (const child of node.children) {
      observer.observe(child);
    }

    node.addEventListener("scroll", syncOverflow, { passive: true });

    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", syncOverflow);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const openAt = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setActiveIndex(index);
    setDirection(0);
    setHasNavigated(false);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const navigate = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= count || nextIndex === activeIndex) {
      return;
    }

    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
    setHasNavigated(true);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      return;
    }

    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(activeIndex + 1);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!start) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    navigate(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <DialogPrimitive.Root
      modal
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
      open={isOpen}
    >
      <section
        aria-label={label}
        aria-roledescription="carousel"
        className={cn(
          "ProjectHeroCarousel not-prose max-w-full min-w-0",
          // "!max-w-[calc(var(--container-text)+var(--spacing-inset)*2)]",
          mdxMediaSpacing,
          "first:pb-small!"
        )}
        data-component="ProjectHeroCarousel"
      >
        <div
          className={cn(
            // extend margins
            "lg:-mr-major"
          )}
        >
          <div
            className={cn(
              "relative w-full max-w-full overflow-hidden",
              // clip edge marks stay on the media row, not the captions
              "before:bg-border before:pointer-events-none before:absolute before:top-0 before:left-0 before:z-1 before:hidden before:h-[clamp(160px,34vw,220px)] before:w-px before:content-['']",
              "after:bg-ring/50 after:pointer-events-none after:absolute after:top-0 after:right-0 after:z-1 after:hidden after:h-[clamp(160px,34vw,220px)] after:w-px after:content-['']",
              // show the marks when the rail can scroll left or right
              "data-[can-scroll-left=true]:before:block",
              "data-[can-scroll-right=true]:after:block"
            )}
            data-can-scroll-left={railOverflow.left ? "true" : undefined}
            data-can-scroll-right={railOverflow.right ? "true" : undefined}
          >
            <div
              className="hide-scrollbar flex gap-2.5 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
              ref={railRef}
            >
              {slides.map((slide, index) => {
                const { width, height } = getImageDimensions(
                  slide.asset.aspect
                );

                return (
                  <div className="flex w-auto shrink-0 flex-col" key={slide.id}>
                    <motion.button
                      aria-label={`Open ${slide.title} ${index + 1} of ${count}`}
                      className={cn(
                        "group border-ring bg-background-hover sm:rounded-button relative w-auto cursor-zoom-in overflow-hidden border",
                        RAIL_MEDIA_HEIGHT,
                        focusVisibleOutlineStyle
                      )}
                      layoutId={
                        reduceMotion ? undefined : `project-hero-${slide.id}`
                      }
                      onClick={(event) => openAt(index, event.currentTarget)}
                      style={{ aspectRatio: `${width} / ${height}` }}
                      transition={{ duration: 0.23, ease: [0.22, 1, 0.36, 1] }}
                      type="button"
                    >
                      <SlideMedia
                        className="pointer-events-none object-cover"
                        sizes="(min-width: 720px) 400px, 80vw"
                        slide={slide}
                      />
                    </motion.button>
                    <Link
                      className={cn(
                        "rounded-button block min-w-0",
                        "text-fill! hover:text-fill! focus-visible:text-fill! no-underline!",
                        focusVisibleOutlineStyle
                      )}
                      href={slide.href}
                    >
                      <StoryPostMeta
                        className="pt-2.5"
                        title={slide.title}
                        yearSpan={slide.yearSpan}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isOpen ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                animate={{ opacity: 1 }}
                className="bg-fill fixed inset-0 z-50"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.12 : 0.23 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              aria-describedby={undefined}
              asChild
              forceMount
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                openerRef.current?.focus();
              }}
              onEscapeKeyDown={close}
              onInteractOutside={(event) => event.preventDefault()}
              onKeyDown={handleKeyDown}
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                closeRef.current?.focus();
              }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              <motion.div
                animate={{ opacity: 1 }}
                className="text-canvas fixed inset-0 z-50 h-dvh w-screen [touch-action:pan-y] overflow-hidden bg-transparent outline-none"
                exit={{ opacity: 0 }}
                initial={false}
                transition={{ duration: reduceMotion ? 0.1 : 0.18 }}
              >
                <DialogPrimitive.Title className="sr-only">
                  {label}
                </DialogPrimitive.Title>

                <div className="absolute inset-[max(3.5rem,env(safe-area-inset-top))_3.5rem_max(1rem,env(safe-area-inset-bottom))] flex items-center justify-center sm:inset-[max(4rem,env(safe-area-inset-top))_5rem_max(1.5rem,env(safe-area-inset-bottom))]">
                  <AnimatePresence
                    custom={direction}
                    initial={false}
                    mode="popLayout"
                  >
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                      custom={direction}
                      exit={{
                        opacity: 0,
                        x: reduceMotion ? 0 : direction * -48,
                      }}
                      initial={{
                        opacity: reduceMotion ? 1 : 0,
                        x: reduceMotion ? 0 : direction * 48,
                      }}
                      key={activeSlide.id}
                      layoutId={
                        reduceMotion || hasNavigated
                          ? undefined
                          : `project-hero-${activeSlide.id}`
                      }
                      transition={{
                        duration: reduceMotion ? 0.12 : 0.23,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <SlideMedia
                        className="rounded-none object-contain"
                        priority
                        sizes="100vw"
                        slide={activeSlide}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <DialogPrimitive.Close asChild>
                  <button
                    aria-label="Close fullscreen carousel"
                    className={cn(
                      "bg-fill/60 text-canvas hover:bg-canvas/15 absolute top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.5rem,env(safe-area-inset-left))] flex size-11 items-center justify-center rounded-full",
                      focusVisibleOutlineStyle
                    )}
                    onClick={close}
                    ref={closeRef}
                    type="button"
                  >
                    <Cross2Icon aria-hidden="true" className="size-5" />
                  </button>
                </DialogPrimitive.Close>

                {activeIndex > 0 ? (
                  <button
                    aria-label="Previous slide"
                    className={cn(
                      "bg-fill/60 text-canvas hover:bg-canvas/15 absolute top-1/2 left-[max(0.25rem,env(safe-area-inset-left))] flex size-11 -translate-y-1/2 items-center justify-center rounded-full",
                      focusVisibleOutlineStyle
                    )}
                    onClick={() => navigate(activeIndex - 1)}
                    type="button"
                  >
                    <ChevronLeftIcon aria-hidden="true" className="size-6" />
                  </button>
                ) : null}

                {activeIndex < count - 1 ? (
                  <button
                    aria-label="Next slide"
                    className={cn(
                      "bg-fill/60 text-canvas hover:bg-canvas/15 absolute top-1/2 right-[max(0.25rem,env(safe-area-inset-right))] flex size-11 -translate-y-1/2 items-center justify-center rounded-full",
                      focusVisibleOutlineStyle
                    )}
                    onClick={() => navigate(activeIndex + 1)}
                    type="button"
                  >
                    <ChevronRightIcon aria-hidden="true" className="size-6" />
                  </button>
                ) : null}

                <p aria-atomic="true" aria-live="polite" className="sr-only">
                  {hasNavigated
                    ? `${activeIndex + 1} of ${count}: ${activeSlide.title}`
                    : ""}
                </p>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
