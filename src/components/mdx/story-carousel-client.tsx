"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Stepper, useAutoPlay } from "pasito/react";
import {
  Children,
  Fragment,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { mdxMediaSpacing } from "./mdx-media";

const AUTOPLAY_DURATION = 5000;

interface StoryCarouselClientProps {
  children: ReactNode;
  className?: string;
  label?: string;
  showControls?: boolean;
}

export function StoryCarouselClient({
  children,
  className,
  label = "Selected work",
  showControls = false,
}: StoryCarouselClientProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = Math.min(activeIndex, Math.max(0, count - 1));
  const carouselId = useId();
  const stepperRef = useRef<HTMLDivElement>(null);
  const autoplayStartedRef = useRef(false);
  const autoplayPausedByPointerRef = useRef(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);

  const selectSlide = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(index, count - 1)));
    },
    [count]
  );

  const { playing, toggle, filling, fillDuration } = useAutoPlay({
    active,
    count,
    enabled: autoplayEnabled && count > 1,
    loop: true,
    onStepChange: selectSlide,
    stepDuration: AUTOPLAY_DURATION,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncAutoplayPreference = () => {
      setAutoplayEnabled(!motionQuery.matches);
    };

    syncAutoplayPreference();
    motionQuery.addEventListener("change", syncAutoplayPreference);
    return () => {
      motionQuery.removeEventListener("change", syncAutoplayPreference);
    };
  }, []);

  useEffect(() => {
    if (!(autoplayEnabled && count > 1)) {
      autoplayStartedRef.current = false;
      autoplayPausedByPointerRef.current = false;
      return;
    }

    if (!autoplayStartedRef.current) {
      autoplayStartedRef.current = true;
      toggle();
    }
  }, [autoplayEnabled, count, toggle]);

  useEffect(() => {
    const steps =
      stepperRef.current?.querySelectorAll<HTMLButtonElement>(".pasito-step");

    steps?.forEach((step, index) => {
      step.id = `${carouselId}-step-${index}`;
      step.setAttribute("aria-controls", `${carouselId}-slide-${index}`);
      step.setAttribute("aria-label", `Show slide ${index + 1} of ${count}`);
    });
  }, [carouselId, count]);

  if (count === 0) {
    return null;
  }

  const focusStep = (index: number) => {
    requestAnimationFrame(() => {
      const steps =
        stepperRef.current?.querySelectorAll<HTMLButtonElement>(".pasito-step");
      steps?.[index]?.focus();
    });
  };

  const stopAutoplay = () => {
    autoplayPausedByPointerRef.current = false;
    if (playing) {
      toggle();
    }
  };

  const pauseAutoplayForPointer = () => {
    autoplayPausedByPointerRef.current = playing;
    if (playing) {
      toggle();
    }
  };

  const resumeAutoplayAfterPointer = () => {
    if (autoplayPausedByPointerRef.current && autoplayEnabled && count > 1) {
      autoplayPausedByPointerRef.current = false;
      toggle();
    }
  };

  const selectSlideAndFocus = (index: number) => {
    selectSlide(index);
    focusStep(index);
  };

  const handleStepperKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target as HTMLElement).closest(".pasito-step")) {
      return;
    }

    let next: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
        next = (active - 1 + count) % count;
        break;
      case "ArrowRight":
        next = (active + 1) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    stopAutoplay();
    selectSlideAndFocus(next);
  };

  const selectPrevious = () => {
    stopAutoplay();
    selectSlide((active - 1 + count) % count);
  };

  const selectNext = () => {
    stopAutoplay();
    selectSlide((active + 1) % count);
  };

  return (
    <section
      aria-label={label}
      aria-roledescription="carousel"
      className={cn(
        "StoryCarousel not-prose max-w-full min-w-0",
        mdxMediaSpacing,
        className
      )}
      data-component="StoryCarousel"
      onFocusCapture={stopAutoplay}
      onPointerEnter={pauseAutoplayForPointer}
      onPointerLeave={resumeAutoplayAfterPointer}
    >
      {/* Slides share one grid cell so the outgoing and incoming cards can
          cross-fade in place without animating a height change. */}
      <div className="grid max-w-full min-w-0" id={`${carouselId}-viewport`}>
        {slides.map((slide, index) => {
          const isActive = index === active;

          return (
            <Fragment
              key={isValidElement(slide) && slide.key ? slide.key : index}
            >
              {/* biome-ignore lint/a11y/useSemanticElements: WAI-ARIA carousel slides require role="group" with aria-roledescription="slide"; fieldset has different semantics. */}
              <div
                aria-hidden={!isActive}
                aria-label={`${index + 1} of ${count}`}
                aria-labelledby={`${carouselId}-step-${index}`}
                aria-roledescription="slide"
                className={cn(
                  "col-start-1 row-start-1 [&>[data-component=StoryPost]]:py-0",
                  // Keep in sync with the Stepper's transitionDuration below so
                  // the pill settles as the card finishes fading.
                  "motion-safe:transition-[opacity,visibility] motion-safe:duration-500 motion-safe:ease-out",
                  // The incoming slide cross-fades above the outgoing one.
                  // `invisible` keeps inactive slides out of hit-testing and
                  // tab order; unlike `hidden` it can be transitioned.
                  isActive ? "visible z-10 opacity-100" : "invisible opacity-0"
                )}
                id={`${carouselId}-slide-${index}`}
                inert={!isActive ? true : undefined}
                role="group"
              >
                {slide}
              </div>
            </Fragment>
          );
        })}
      </div>

      {showControls ? (
        <div className="mt-w4 flex max-w-full items-center justify-center gap-3 overflow-hidden">
          <Button
            aria-controls={`${carouselId}-viewport`}
            aria-label="Previous slide"
            className="border-border bg-background size-[22px]! shrink-0 rounded-full border [&_svg]:size-3!"
            onClick={selectPrevious}
            size="reset"
            type="button"
            variant="icon"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>

          {/* biome-ignore lint/a11y/noStaticElementInteractions: Keyboard events are delegated to Pasito's descendant step buttons. */}
          <div
            className="flex"
            onKeyDown={handleStepperKeyDown}
            ref={stepperRef}
          >
            <Stepper
              active={active}
              className={cn(
                "max-w-full",
                "[--pill-bg:var(--color-ring)]!",
                "[--pill-active-bg:var(--color-fill)]!",
                "[--pill-container-bg:var(--color-background)]!",
                "[--pill-container-border:var(--color-border)]!"
              )}
              count={count}
              fillDuration={fillDuration}
              filling={filling}
              maxVisible={6}
              onStepClick={(index) => {
                stopAutoplay();
                selectSlide(index);
              }}
              transitionDuration={500}
            />
          </div>

          <Button
            aria-controls={`${carouselId}-viewport`}
            aria-label="Next slide"
            className="border-border bg-background size-[22px]! shrink-0 rounded-full border [&_svg]:size-3!"
            onClick={selectNext}
            size="reset"
            type="button"
            variant="icon"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </div>
      ) : null}

      <p
        aria-atomic="true"
        aria-live={playing ? "off" : "polite"}
        className="sr-only"
      >
        Slide {active + 1} of {count}
      </p>
    </section>
  );
}
