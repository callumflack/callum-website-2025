"use client";

import Image from "next/image";
import { useState } from "react";

const BASE_SRC = "/images/hiposter-artwork-animated.svg?v=260220-9";

export const HiPosterPlayer = () => {
  const [hasLoadedArtwork, setHasLoadedArtwork] = useState(false);
  const [restartNonce, setRestartNonce] = useState(0);

  return (
    <>
      {hasLoadedArtwork ? (
        <button
          type="button"
          onClick={() => setRestartNonce((value) => value + 1)}
          className="bg-canvas fixed top-2 right-2 z-999 border px-2 py-1 text-[11px] leading-none"
        >
          Restart
        </button>
      ) : null}

      <main className="relative z-10 flex min-h-[calc(100dvh-var(--spacing-nav)-1px)] items-center">
        {hasLoadedArtwork ? (
          <Image
            key={restartNonce}
            src={BASE_SRC}
            alt="Animated line artwork from HiPoster"
            width={1191}
            height={842}
            className="relative z-10 h-auto w-full"
            priority
            unoptimized
          />
        ) : (
          <div className="container flex justify-end">
            <button
              type="button"
              onClick={() => setHasLoadedArtwork(true)}
              className="bg-canvas border px-3 py-2 text-[11px] leading-none"
            >
              Load artwork
            </button>
          </div>
        )}
      </main>
    </>
  );
};
