import { Link, Text } from "@/components/atoms";
import { TitleHeader } from "@/components/elements";
import { Intro, Outro, PageInner, PageWrapper } from "@/components/page";
import { PostBlock, PostLine } from "@/components/post";
import type { Post } from "content-collections";
import { HomeFeaturedGrid } from "./home-featured-grid";
import { HomeFolioClient } from "./home-folio-client";
import { HomeLayoutToggle } from "./home-layout-toggle";
import { ZoomCarousel } from "./zoom-carousel";

export const HomePage = ({
  latestPosts,
  projects,
  writing,
  featuredGridPosts,
  layout,
}: {
  latestPosts: Post[];
  projects: Post[];
  writing: Post[];
  featuredGridPosts: Post[];
  layout: "default" | "grid";
}) => {
  const isGridMode = layout === "grid";

  return (
    <>
      <HomeLayoutToggle layout={layout} />
      <PageWrapper
        hideFooter={isGridMode}
        showIntro={false}
        footerNode={
          isGridMode ? undefined : (
            /* OUTRO */
            <div>
              <TitleHeader as="div">
                <Text as="h3" intent="title" className="flex">
                  Connect
                </Text>
              </TitleHeader>
              <div className="pt-w6 container">
                <Outro showLabel={true} textIntent="body" />
              </div>
            </div>
          )
        }
      >
        {isGridMode ? (
          <PageInner variant="index">
            <HomeFeaturedGrid posts={featuredGridPosts} />
            <RuleWithinInner />
          </PageInner>
        ) : (
          <>
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
              <div className="container">
                {latestPosts.map((post) => (
                  <Link key={post.slug} href={`/${post.slug}`}>
                    <PostLine post={post} isFeatured={false} isFeed />
                  </Link>
                ))}
              </div>
              <RuleWithinInner />
            </PageInner>

            {/* FOLIO */}
            <HomeFolioClient>
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
            </HomeFolioClient>

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
          </>
        )}
      </PageWrapper>
    </>
  );
};

const RuleWithinInner = () => {
  return (
    <div data-component="RuleWithinInner" className="pt-w5">
      <hr />
    </div>
  );
};
