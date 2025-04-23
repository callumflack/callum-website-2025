"use client";

import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { Intro, Outro, PageInner, PageWrapper } from "@/components/page";
import { PostBlock, PostLine } from "@/components/post";
import { BodyClassProvider } from "@/components/utils/body-class-provider";
import { Post } from "content-collections";
import { cx } from "cva";
import { useState } from "react";
import { ZoomCarousel } from "./zoom-carousel";

export const HomePage = ({
  latestPost,
  projects,
  writing,
}: {
  latestPost: Post;
  projects: Post[];
  writing: Post[];
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <BodyClassProvider
      condition={isZoomed}
      className={cx(
        "bg-canvas"
        // UNDECIDED! I kinda like it just plain today…
        // "overflow-hidden",
        // "bg-background-hover",
        // "[&_[data-component=Nav]]:bg-background-hover",
        // "[&_[data-component=Nav]_a]:opacity-[0.0]",
        // "[&_[data-component=Nav]_span]:opacity-[0.0]",
        // "[&_[data-component=PageInner]:not(.Folio)]:opacity-[0.0]",
        // "[&_[data-component=TitleHeader]]:opacity-[0.0]",
        // "[&_[data-component=RuleWithinInner]]:opacity-[0.0]"
      )}
    >
      {/* Close overlay for the EnhancedZoomable */}
      {/* {isZoomed && (
        <div
          className="absolute inset-0 z-99 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        ></div>
      )} */}

      <PageWrapper
        showIntro={false}
        footerNode={
          /* OUTRO */
          <div>
            <TitleHeader as="div">
              <Text as="h3" intent="title" className="flex">
                Stay in touch
              </Text>
            </TitleHeader>
            <div className="pt-w6 container">
              <Outro showLabel={true} textIntent="body" />
            </div>
          </div>
        }
      >
        {/* INTRO */}
        <PageInner variant="index">
          <header className="container">
            <Intro showLabel={false} textIntent="body" />
          </header>
          <RuleWithinInner />
        </PageInner>

        {/* LATEST */}
        <PageInner variant="home">
          <TitleHeader as="div">
            <Text as="h1" intent="title" className="flex">
              <Link href="/log" className="hover:text-accent flex-1">
                Latest
              </Link>
            </Text>
          </TitleHeader>
          <div className="pt- container">
            <Link href={`/${latestPost.slug}`}>
              <PostLine post={latestPost} isFeatured={false} isFeed />
            </Link>
          </div>
          <RuleWithinInner />
        </PageInner>

        {/* FOLIO */}
        <PageInner
          variant="home"
          className={cx(
            "relative",
            isZoomed ? "Folio z-100 cursor-zoom-out" : ""
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <TitleHeader as="div">
            <Text as="h3" intent="title" className="flex">
              <Link href="/work" className="hover:text-accent flex-1">
                Selected Work
              </Link>
            </Text>
          </TitleHeader>
          <div className="pt-w6">
            {/* avoid hydration jank: this or min-height */}
            {/* {!isHydrated ? (          
              <div 
                className="w-full h-[400px] bg-background-hover rounded-md"
                style={{ aspectRatio: "16/9" }} // Match slider aspect ratio
              ></div> */}
            {/* // min-h avoids hydration jank
              className="z-2 min-h-[276px] sm:min-h-[331px]"? */}
            <ZoomCarousel projects={projects} />
          </div>
          <RuleWithinInner />
        </PageInner>

        {/* WRITING */}
        <PageInner variant="home">
          <TitleHeader as="div">
            <Text as="h3" intent="title" className="flex">
              <Link href="/writing" className="hover:text-accent flex-1">
                Selected Writing
              </Link>
            </Text>
          </TitleHeader>
          <div className="gap-w6 pt-w6 container flex flex-col">
            {writing.map((post) => (
              <Link key={post.slug} href={`/${post.slug}`}>
                <PostBlock post={post} priority={false} />
              </Link>
            ))}
          </div>
          <RuleWithinInner />
        </PageInner>

        {/* IN TOUCH */}
        {/* <PageInner variant="home">
          <TitleHeader as="div">
            <Text as="h3" intent="title" className="flex">
              Stay in touch
            </Text>
          </TitleHeader>
          <div className="gap-w6 pt-w6 container flex flex-col">
            <Link href="/log">
              <Text as="p" intent="body">
                The best way to stay in touch is write me an email. The second
                best way is to subscribe to my newsletter.
              </Text>
            </Link>
            <Contacts showLabel />
          </div>
          <RuleWithinInner />
        </PageInner> */}
      </PageWrapper>
    </BodyClassProvider>
  );
};

const RuleWithinInner = () => {
  return (
    <div data-component="RuleWithinInner" className="pt-w5">
      <hr />
    </div>
  );
};
