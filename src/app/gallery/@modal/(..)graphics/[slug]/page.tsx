import { notFound } from "next/navigation";
import { DialogContent } from "@/app/gallery/(components)/dialog-content";
import { getProjectBySlug } from "@/app/gallery/(components)/actions";

/* Intercepted route for modal view */

export default async function InterceptedProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return <DialogContent isModal project={project} />;
}
