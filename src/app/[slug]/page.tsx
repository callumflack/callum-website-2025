import { notFound } from "next/navigation";
// import config from "@/components/config";
// import { isVideoFile } from "@/components/utils";
// import { allPosts } from "content-collections";
// import { PagePost } from "@/components/page";
import { allPosts } from "content-collections";
import { PageWrapper, PostMeta } from "@/components/page";
import { Mdx } from "@/components/mdx";
import { Button, Link, Text } from "@/components/atoms";
import { formatPostDate, getYear } from "@/lib/utils";
import Image from "next/image";
import { ContactIcons } from "@/components/page/contacts";
import { SiteTime } from "@/components/page/site-time";
import { Suspense } from "react";
import { Link2Icon, DownloadIcon } from "@radix-ui/react-icons";
import { MdiLanguageMarkdownOutline } from "@/components/icons/MdiLanguageMarkdownOutline";
import { cx } from "class-variance-authority";
import { OutsetRule } from "@/components/elements/outset-rule";

interface Params {
  slug: string;
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const categoryLink = post.category === "projects" ? `/work` : `/writing`;
  // const tagsWithoutFeatured = post.tags?.filter((tag) => tag !== "featured");
  const date = formatPostDate(post.date);
  const year = getYear(post.date);
  const endYear = post.endDate ? getYear(post.endDate) : null;

  // console.log(post);

  // return <PagePost post={post} />;
  return (
    <PageWrapper footerChildren={<FooterBlock />}>
      {post.category !== "about" && (
        <header className="container space-y-2">
          <Text as="h1" intent="title" balance>
            {post.title}
          </Text>
          <Text intent="meta" dim className="flex items-center gap-2">
            <>
              {/* Date */}
              <Link
                className="capitalize"
                href={`${categoryLink}?sort=year#${year}`}
              >
                {post.category === "writing" || post.category === "note"
                  ? date
                  : year}
              </Link>

              {/* End date, e.g. for a project */}
              {endYear ? (
                <>
                  &ndash;
                  <Link href={`${categoryLink}?sort=year#${endYear}`}>
                    {endYear}
                  </Link>
                </>
              ) : null}

              {/* Reading time */}
              {(post.category === "writing" || post.category === "note") &&
              post.readingTime >= 3 ? (
                <>
                  <hr className="hr-vertical border-border-hover h-[13px]" />
                  {post.readingTime % 1 >= 0.7
                    ? Math.ceil(post.readingTime)
                    : Math.floor(post.readingTime)}{" "}
                  min
                  {(post.readingTime % 1 >= 0.7
                    ? Math.ceil(post.readingTime)
                    : Math.floor(post.readingTime)) !== 1
                    ? "s"
                    : ""}
                </>
              ) : null}
            </>
          </Text>
        </header>
      )}

      {/* <PostMeta post={post} /> */}
      <Mdx code={post.content}></Mdx>

      <OutsetRule wrapperClassName="mt-w20 mb-w8" />
      <div className="gap-w4 pb-w16 container flex items-center">
        <Button
          variant="outline"
          size="sm"
          PrefixIcon={<Link2Icon />}
          // onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          Share
        </Button>
        {/* get the github raw file link, or public/john-boyds-bloody-mindedness.md */}
        <Button variant="outline" size="sm" PrefixIcon={<DownloadIcon />}>
          Download
        </Button>
      </div>
    </PageWrapper>
  );
}

const FooterBlock = () => {
  return (
    <div className="space-y-2.5">
      <div className="shrink-0 pb-1">
        <Image
          src="/images/callum-flack.jpg"
          alt="Callum Flack"
          width={60}
          height={60}
          className="rounded-full"
        />
      </div>

      <Text as="p" intent="meta">
        I&apos;m Callum Flack — a software engineer, writer, and founder. I
        currently work as the CEO of Buttondown, the best way to start and grow
        your newsletter, and as a partner at Third South Capital. Read about me{" "}
        <Link href="/about" className="link">
          here
        </Link>
        .
      </Text>
      <Text intent="meta" dim>
        <Suspense fallback={<>Loading time…</>}>
          <SiteTime />
        </Suspense>
      </Text>
      <ContactIcons showLabel />

      {/* <hr className="my-w6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="X">
              <Text as="h3" intent="meta">
                Featured Posts
              </Text>
              <Text as="ul" intent="meta" className="space-y-1 !pl-0">
                {allPosts
                  .filter(
                    (post) => post.tags?.includes("featured") && !post.draft
                  )
                  .map((post) => (
                    <li key={post.slug}>
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </li>
                  ))}
              </Text>
            </div>
            <div className="Y">
              <Text as="h3" intent="meta">
                Featured Posts
              </Text>
              <Text as="ul" intent="meta" className="space-y-1 !pl-0">
                {allPosts
                  .filter(
                    (post) => post.tags?.includes("featured") && !post.draft
                  )
                  .map((post) => (
                    <li key={post.slug}>
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </li>
                  ))}
              </Text>
            </div>
          </div> */}

      {/* <hr className="my-w6" />
          <Text intent="meta" dim>
            <Suspense fallback={<>Loading time…</>}>
              <SiteTime />
            </Suspense>
          </Text> */}
    </div>
  );
};
