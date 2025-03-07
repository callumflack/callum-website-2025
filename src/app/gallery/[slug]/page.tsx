import { Link } from "@/components/atoms";
import config from "@/config";
import { slugify } from "@/lib/utils";
import { cx } from "cva";
import { notFound } from "next/navigation";
import projects from "@/app/gallery/(components)/projects";
import { DialogContent } from "@/app/gallery/(components)/dialog-content";
import { graphicsDescription } from "@/app/gallery/(components)/copy";
import { getProjectBySlug } from "@/app/gallery/(components)/actions";

export default async function InterceptedProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <Link className="absolute inset-0 cursor-zoom-out" href="/graphics">
      <main
        className={cx(
          "container max-w-[1320px]",
          // duplicate DialogContent styles
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        )}
      >
        <DialogContent isModal={false} project={project} />
      </main>
    </Link>
  );
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: slugify(project.title),
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => slugify(p.title) === params.slug);
  if (!project) {
    return;
  }

  const { title, date: publishedTime, image } = project;
  const imageUrl = `${config.PUBLIC_URL}${image}`;

  return {
    title,
    description: graphicsDescription,
    openGraph: {
      title: `${title} — Callum Flack`,
      description: graphicsDescription,
      type: "article",
      publishedTime,
      url: `${config.PUBLIC_URL}/graphics/${params.slug}`,
      images: [
        {
          url: imageUrl,
        },
      ],
    },
  };
}
