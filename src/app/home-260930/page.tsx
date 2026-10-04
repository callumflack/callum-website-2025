import { allPosts } from "content-collections";
import type { Metadata } from "next";
import { Intro, NewsletterSubscribe, PageWrapper } from "@/components/page";
import { HomeIndex } from "../(home)/home-index";

export default function Home260930() {
  const homeStory = allPosts.find(
    (post) => !post.draft && post.slug === "home"
  );

  if (!homeStory) {
    throw new Error("Missing published homepage story: posts/pages/home.mdx");
  }

  return (
    <PageWrapper hideFooter navigation={null}>
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
          <HomeIndex homeContent={homeStory.content} />
        </div>

        <div className="pt-w12 container">
          <NewsletterSubscribe />
        </div>
      </div>
    </PageWrapper>
  );
}

export const metadata: Metadata = {
  title: "Home 260930",
  robots: { index: false, follow: false },
};
