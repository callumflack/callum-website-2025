const title = `Work — Callum Flack Design & Development`;
const description = "An archive of design and programming projects.";

export const generateMetadata = () => {
  return {
    title,
    description,
    twitter: {
      title,
      description,
    },
  };
};

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
