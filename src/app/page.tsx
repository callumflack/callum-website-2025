import { allPosts } from "content-collections";
import { Suspense } from "react";
import { Intro, NewsletterSubscribe, PageWrapper } from "@/components/page";
import { getAllPostsChronological, toPostListItem } from "@/lib/posts/actions";
import { HomeIndex } from "./(home)/home-index";

export default function Home() {
  const homeStory = allPosts.find(
    (post) => !post.draft && post.slug === "home"
  );

  if (!homeStory) {
    throw new Error("Missing published homepage story: posts/pages/home.mdx");
  }

  const recentPosts = getAllPostsChronological()
    .slice(0, 12)
    .map(toPostListItem);

  return (
    <PageWrapper hideFooter showNav={false}>
      <div className="pt-w20 pb-w72" data-slot="home-inner">
        <header className="container">
          <Intro
            showLabel={false}
            showContacts={true}
            showCurrentPrev={true}
            showWhatIWant={true}
            textIntent="body"
          />
        </header>

        <div className="pt-small" data-slot="home-content">
          <Suspense fallback={null}>
            <HomeIndex
              homeContent={homeStory.content}
              recentPosts={recentPosts}
            />
          </Suspense>
        </div>

        <div className="pt-w12 container">
          <NewsletterSubscribe />
        </div>
      </div>
    </PageWrapper>
  );
}
