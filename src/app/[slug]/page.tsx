import { buttonVariants, Link, Text } from "@/components/atoms";
import { OutsetRule, TitleHeader } from "@/components/elements";
import { DownloadButtonWrapper } from "@/components/elements/download-button-wrapper";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { isVideoFile } from "@/components/media";
import {
  getCategoryNavRoute,
  NavRoute,
  PageInner,
  PageWrapper,
  PostPage,
} from "@/components/page";
import config from "@/config";
import { getGithubRawUrl } from "@/lib/github/actions";
import { cn } from "@/lib/utils";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { allPosts } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* UNUSED POSSIBILITIES! */
// import { CVDownloadButtonWrapper } from "@/components/elements/cv-download-button-wrapper";
// import { getGithubIssueUrl, getGithubRawUrl } from "@/lib/github/actions";

interface Params {
  slug: string;
}

export default async function SlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const isAboutPage = post.slug === "about";
  const isNowPage = post.slug === "now";
  const isWorkPage = post.slug === "the-work-and-team-im-after";
  const isLettersPage = post.slug === "letters";
  const isPage = post.type === "page";

  const renderActiveNav = () => {
    if (isAboutPage || isWorkPage) {
      return NavRoute.ABOUT;
    }
    if (isNowPage) {
      return NavRoute.NOW;
    }
    return getCategoryNavRoute(post.category);
  };

  return (
    <PageWrapper
      activeNav={renderActiveNav()}
      showIntro={!isPage}
      showWhatIWant={!isWorkPage}
      /* Remove the entire footer (no wrapper spacing) for content pages like letters */
      hideFooter={isLettersPage}
      shareNode={
        isLettersPage ? null : (
          <div>
            <OutsetRule />
            <div className="py-w8 gap-w4 container flex items-center">
              <ShareButtonWrapper
                url={`${config.PUBLIC_URL}/${post.slug}`}
                theme="post"
              />
              <DownloadButtonWrapper
                url={getGithubRawUrl(post._id)}
                filename={`${post.slug}.md`}
                label="Download"
              />
              {/* {!isPage && (
                <Link
                  href={await getGithubIssueUrl(post.slug)}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Comment on GitHub
                </Link>
              )} */}
              {/* {isAboutPage || isWorkPage ? (
                <CVDownloadButtonWrapper
                  filename="CallumFlackCV2024.pdf"
                  label="Download CV"
                />
              ) : null} */}
              {post.tweet && (
                <Link
                  href={post.tweet}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <ChatBubbleIcon className="size-em" />
                  Comment on X
                </Link>
              )}
            </div>
          </div>
        )
      }
    >
      <PageInner variant={isNowPage ? "index" : "post"}>
        {isNowPage && (
          <TitleHeader>
            <Text as="h1" intent="title">
              {post.title}
            </Text>
          </TitleHeader>
        )}
        <PostPage post={post} theme="post" />
      </PageInner>
    </PageWrapper>
  );
}

export function generateStaticParams(): Params[] {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) {
    return;
  }

  const { title, date: publishedTime, summary: description, assets } = post;
  const asset = assets?.[0];
  let image;

  if (asset?.src) {
    if (isVideoFile(asset.src) && asset.poster) {
      image = `${config.PUBLIC_URL}${asset.poster}`;
    } else {
      image = `${config.PUBLIC_URL}${asset.src}`;
    }
  } else {
    image = `${config.PUBLIC_URL}/opengraph-image.png`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Callum Flack`,
      description,
      type: "article",
      publishedTime,
      url: `${config.PUBLIC_URL}/${post.slug}`,
      images: [
        {
          url: image,
        },
      ],
    },
  };
}
