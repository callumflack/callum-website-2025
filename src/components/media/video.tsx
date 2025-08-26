"use client";

import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";
import type { SVGProps, VideoHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import {
  getAspectRatioCSS,
  type AspectRatio,
} from "@/components/media/media-utils";
import { useDeviceDetect } from "@/lib/hooks/use-device-detect";
import { MediaErrorBoundary } from "@/components/utils";
import { VideoLoader } from "./video-loader";
// import { useIsMobileViewport } from "@/hooks/use-breakpoint";

export interface VideoProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "onError"> {
  src: string;
  poster: string;
  aspect: AspectRatio;
  className: string;
  allowSound?: boolean;
  onError?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  // sizes?: string;
}

// Video component with lazy loading and autoplay
// Note for future: Consider addressing mobile autoplay behavior
// Current implementation might conflict with browser autoplay policies
// especially on mobile devices where autoplay with sound is often blocked
export const Video = ({
  src,
  poster,
  aspect,
  className,
  allowSound,
  onError,
  ...rest
}: VideoProps) => {
  const { isMobileViewport } = useDeviceDetect();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoStatus, setVideoStatus] = useState<
    "loading" | "ready" | "playing" | "error"
  >("loading");
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadataLoaded = async () => {
      await new Promise<void>((resolve) => {
        if (video.readyState > 0) {
          resolve();
        } else {
          video.addEventListener(
            "loadedmetadata",
            () => {
              resolve();
            },
            {
              // The 'loadedmetadata' event listener doesn't need explicit cleanup in this case because we're using the { once: true } option when adding the event listener. This option automatically removes the listener after it fires once, preventing any potential memory leaks.
              once: true,
            }
          );
        }
      });
      setVideoStatus("ready");
    };

    const handlePlay = () => {
      setVideoStatus("playing");
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setVideoStatus("error");
      if (onError && video) {
        // Create a synthetic event to match React's expected type
        const syntheticEvent = {
          nativeEvent: e,
          currentTarget: video,
          target: e.target,
          preventDefault: () => e.preventDefault?.(),
          stopPropagation: () => e.stopPropagation?.(),
          isPropagationStopped: () => false,
          isDefaultPrevented: () => false,
          persist: () => {},
          type: e.type,
        } as React.SyntheticEvent<HTMLVideoElement, Event>;

        onError(syntheticEvent);
      }
    };

    const setupVideo = async () => {
      try {
        await handleMetadataLoaded();
        video.addEventListener("play", handlePlay);
        video.addEventListener("error", handleError);
      } catch (err) {
        console.error("Error setting up video:", err);
        setVideoStatus("error");
      }
    };

    // Call the async function using void operator
    void setupVideo();

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("error", handleError);
    };
  }, [onError]);

  return (
    <MediaErrorBoundary>
      <div className="relative">
        {/* DO NOT render conditionally. Event listeners and refs must attach! */}
        {/* autoPlay={!isMobileViewport} */}
        <video
          autoPlay
          className={className}
          loop
          muted={!isMobileViewport && !sound}
          playsInline
          ref={videoRef}
          style={{
            display:
              videoStatus === "loading" || videoStatus === "error"
                ? "none"
                : "block",
            // We do NOT pass height or width to the video element b/c unlike images we can't use sizes to re-adjust the rendered dimensions.
            // Use aspect ratio instead, relying on the parent container to set the width.
            aspectRatio: getAspectRatioCSS(aspect),
          }}
          {...rest}
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* SOUND (Desktop) */}
        {allowSound && videoStatus !== "error" ? (
          <div className="absolute right-4 bottom-4 z-100">
            <button
              aria-label={sound ? "Mute" : "Unmute"}
              className="bg-fill text-canvas p-2 hover:cursor-pointer"
              onClick={(e) => {
                // Prevent click from bubbling up to parent elements, eg. Zoomable
                e.stopPropagation();
                setSound(!sound);
              }}
              type="button"
            >
              {sound ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
            </button>
          </div>
        ) : null}

        {/* LOADING OR ERROR - both show the poster */}
        {(videoStatus === "loading" || videoStatus === "error") && poster ? (
          <div className="relative">
            <VideoLoader aspect={aspect} className={className} poster={poster} />
            {videoStatus === "error" && (
              <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                <div className="max-w-[80%] rounded bg-white p-2 text-center dark:bg-gray-800">
                  <p className="text-sm">Video could not be loaded</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </MediaErrorBoundary>
  );
};

// const MobilePlayButton = ({
//   onClick,
//   poster,
//   aspect,
// }: {
//   onClick: () => void;
//   poster: string;
//   aspect: AspectRatio;
// }) => {
//   return (
//     <button className="absolute inset-0" onClick={onClick} type="button">
//       <VideoPoster aspect={aspect} poster={poster} />
//       <div className="absolute inset-0 flex items-center justify-center">
//         <div className="flex items-center justify-center rounded-full border-2 border-fill bg-[rgba(255,255,255,0.7)] p-2 text-fill">
//           <CarbonPlayFilledAlt className="size-7 translate-x-[0.1em] transform" />
//         </div>
//       </div>
//     </button>
//   );
// };

export function CarbonPlayFilledAlt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="1em"
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 28a1 1 0 0 1-1-1V5a1 1 0 0 1 1.482-.876l20 11a1 1 0 0 1 0 1.752l-20 11A1 1 0 0 1 7 28Z"
        fill="currentColor"
      />
    </svg>
  );
}
