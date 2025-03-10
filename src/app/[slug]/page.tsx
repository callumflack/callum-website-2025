import { buttonVariants } from "@/components/atoms";
import { Link, Text } from "@/components/atoms";
import { OutsetRule } from "@/components/elements";
import { DownloadButtonWrapper } from "@/components/elements/download-button-wrapper";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { isVideoFile } from "@/components/media";
import { PageWrapper, PostPage, PostPageInner } from "@/components/page";
import config from "@/config";
import { getGithubRawUrl } from "@/lib/github/actions";
import { allPosts } from "content-collections";
import { cx } from "cva";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Params {
  slug: string;
}

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const renderActiveNav = () => {
    if (post.category === "projects") return "work";
    if (post.category === "writing") return "writing";
    if (post.category === "note") return "feed";
    if (post.category === "about") return "the-work-and-team-im-after";
    return undefined;
  };

  return (
    <PageWrapper
      activeNav={renderActiveNav()}
      showIntro
      shareNode={
        <div className="pt-w1">
          <OutsetRule />
          <div className="py-w8 gap-w4 container flex items-center">
            <ShareButtonWrapper
              url={`${config.PUBLIC_URL}/${post.slug}`}
              theme="post"
            />
            <DownloadButtonWrapper
              url={await getGithubRawUrl(post.slug, post)}
              filename={`${post.slug}.md`}
              label="Download"
            />
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <>
                <Text as="p" intent="pill" dim className="pl-2">
                  Tags:
                </Text>
                <div className="flex items-center gap-1">
                  {post.tags
                    .filter((tag) => tag !== "featured")
                    .map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className={cx(
                          buttonVariants({
                            variant: "pill",
                          }),
                          "group-hover:border-fill"
                        )}
                      >
                        <span>{tag}</span>
                      </Link>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      }
    >
      <PostPageInner>
        <PostPage post={post} />
      </PostPageInner>
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
  params: Params;
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
