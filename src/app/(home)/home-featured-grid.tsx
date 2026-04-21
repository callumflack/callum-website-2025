import { Link } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { Post } from "content-collections";
import { HomeGridBlock, HomeIntroCard } from "./home-grid-block";

interface HomeFeaturedGridProps {
  posts: Post[];
}

export function HomeFeaturedGrid({ posts }: HomeFeaturedGridProps) {
  return (
    <section
      data-component="HomeFeaturedGrid"
      className="px-inset pb-w72 w-full"
    >
      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          "lg:grid-cols-4",
          "2xl:grid-cols-6"
        )}
      >
        {/* 2xl:col-span-2 */}
        <div className="">
          <HomeIntroCard />
        </div>

        {posts.map((post) => (
          <div key={post.slug}>
            <Link href={`/${post.slug}`}>
              <HomeGridBlock post={post} priority={false} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
