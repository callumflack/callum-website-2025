import { buttonVariants } from "@/components/atoms";
import { Link } from "@/components/atoms";
import { OutsetRule } from "@/components/elements";
import { DownloadButtonWrapper } from "@/components/elements/download-button-wrapper";
import { CVDownloadButtonWrapper } from "@/components/elements/cv-download-button-wrapper";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { isVideoFile } from "@/components/media";
import {
  PageWrapper,
  PostPage,
  PageInner,
  getCategoryNavRoute,
  NavRoute,
} from "@/components/page";
import config from "@/config";
import { getGithubRawUrl } from "@/lib/github/actions";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { allPosts } from "content-collections";
import { cx } from "cva";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Category } from "@/types/content";

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

  const renderActiveNav = () => {
    if (post.slug === Category.ABOUT) {
      return NavRoute.ABOUT;
    }
    return getCategoryNavRoute(post.category);
  };

  return (
    <PageWrapper
      activeNav={renderActiveNav()}
      showIntro={post.slug === Category.ABOUT ? false : true}
      showWhatIWant={post.slug === "the-work-and-team-im-after" ? false : true}
      shareNode={
        <div>
          <OutsetRule />
          <div className="py-w8 gap-w4 container flex items-center">
            <ShareButtonWrapper
              url={`${config.PUBLIC_URL}/${post.slug}`}
              theme="post"
            />
            {post.category === Category.ABOUT ||
            post.slug === "the-work-and-team-im-after" ? (
              <CVDownloadButtonWrapper
                filename="CallumFlackCV2024.pdf"
                label="Download CV"
              />
            ) : (
              <DownloadButtonWrapper
                url={await getGithubRawUrl(post.slug)}
                filename={`${post.slug}.md`}
                label="Download"
              />
            )}
            {post.tweet && (
              <Link
                href={post.tweet}
                target="_blank"
                className={cx(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                <ChatBubbleIcon className="size-em" />
                Tweet
              </Link>
            )}
          </div>
        </div>
      }
    >
      <PageInner variant="post">
        <PostPage post={post} theme="post" />
      </PageInner>
    </PageWrapper>
  );
}

export function generateStaticParams(): Params[] {
  return allPosts.map((post) => ({
    slug: post._meta.path,
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
