import { notFound } from "next/navigation";
// import config from "@repo/ui/config";
// import { isVideoFile } from "@repo/ui/utils";
// import { allPosts } from "contentlayer/generated";
// import { PagePost } from "@/components/page";
import { allPosts } from "content-collections";
import { PageWrapper } from "@/components/page/page-wrapper";
import { Mdx } from "@/components/mdx";
interface Params {
  slug: string;
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // return <PagePost post={post} />;
  return (
    <PageWrapper>
      {/* container = 620px wide */}
      <div className="container max-w-(--container-hero-inset)">
        <h1 className="container">{post.title}</h1>
        <Mdx code={post.content} />
      </div>
    </PageWrapper>
  );
}
