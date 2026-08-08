import { StoryCarouselClient } from "./story-carousel-client";
import { getStorySlideKey, StoryPost, type StorySlide } from "./story-post";

interface StoryCarouselProps {
  className?: string;
  label?: string;
  showControls?: boolean;
  slides: readonly StorySlide[];
}

export function StoryCarousel({
  className,
  label,
  showControls = false,
  slides,
}: StoryCarouselProps) {
  return (
    <StoryCarouselClient
      className={className}
      label={label}
      showControls={showControls}
    >
      {slides.map((slide, index) => (
        <StoryPost key={getStorySlideKey(slide, index)} {...slide} />
      ))}
    </StoryCarouselClient>
  );
}
