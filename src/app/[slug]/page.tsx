import { OutsetRule } from "@/components/elements";
import { DownloadButtonWrapper } from "@/components/elements/download-button-wrapper";
import { ShareButtonWrapper } from "@/components/elements/share-button-wrapper";
import { isVideoFile } from "@/components/media";
import { PageWrapper, PostPage } from "@/components/page";
import config from "@/config";
import { getGithubRawUrl } from "@/lib/github/actions";
import { allPosts } from "content-collections";
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
          </div>
        </div>
      }
    >
      <PostPage post={post} />
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
