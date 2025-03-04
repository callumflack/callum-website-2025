import { allPosts } from "content-collections";
// import { MDXContent } from "@content-collections/mdx/react";
import { PageWrapper } from "@/components/page/page-wrapper-0";
import NextLink from "next/link";

export default function Home() {
  // console.log(allPosts);
  return (
    <PageWrapper>
      <main className="container">
        <ul className="space-y-4">
          {allPosts.map((post) => (
            <li key={post._meta.path}>
              <NextLink href={`/${post.slug}`}>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                {/* <MDXContent code={post.content} /> */}
              </NextLink>
            </li>
          ))}
        </ul>
      </main>
    </PageWrapper>
  );
}
