"use client";

import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";
import type { SVGProps, VideoHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { useDeviceDetect } from "@/lib/hooks/use-device-detect";
import { VideoLoader } from "./video-loader";

export interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster: string;
  aspect: string;
  className: string;
  allowSound?: boolean;
  // sizes?: string;
}

export const Video = ({
  src,
  poster,
  aspect,
  className,
  allowSound,
}: VideoProps) => {
  const { isMobileViewport } = useDeviceDetect();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoStatus, setVideoStatus] = useState<
    "loading" | "ready" | "playing"
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

    const setupVideo = async () => {
      await handleMetadataLoaded();
      video.addEventListener("play", handlePlay);
    };

    // Call the async function using void operator
    void setupVideo();

    return () => {
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  // useEffect(() => {
  //   console.log("Video status:", videoStatus);
  // }, [videoStatus]);

  return (
    <div className="relative">
      {/* DO NOT render conditionally. Event listeners and refs must attach! */}
      {/* autoPlay={!isMobileViewport} */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- video is controlled by the user */}
      <video
        autoPlay
        className={className}
        loop
        muted={!isMobileViewport && !sound}
        playsInline
        ref={videoRef}
        style={{
          display: videoStatus === "loading" ? "none" : "block",
          aspectRatio: aspect.replace("-", " / "),
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* SOUND (Desktop) */}
      {allowSound ? (
        <div className="absolute right-4 bottom-4">
          <button
            aria-label={sound ? "Mute" : "Unmute"}
            className="bg-fill text-canvas p-2"
            onClick={() => {
              setSound(!sound);
            }}
            type="button"
          >
            {sound ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
          </button>
        </div>
      ) : null}

      {/* PLAY (Mobile) */}
      {/* {isMobileViewport && videoStatus !== "playing" && poster && (
        <MobilePlayButton
          onClick={() => videoRef.current?.play()}
          poster={poster}
          aspect={aspect}
        />
      )} */}

      {/* LOADING */}
      {/* !isMobileViewport? */}
      {videoStatus === "loading" && poster ? (
        <VideoLoader aspect={aspect} className={className} poster={poster} />
      ) : null}
    </div>
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
