import Image from "next/image";
import { allPosts } from "content-collections";
// import { MDXContent } from "@content-collections/mdx/react";
import NextLink from "next/link";
import { PageWrapper } from "@/components/page/page-wrapper";

export default function Home() {
  // console.log(allPosts);
  return (
    <PageWrapper>
      <main className="container">
        <ul>
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
