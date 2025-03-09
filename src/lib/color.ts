// show all tags except "featured"
export const postTags = [
  "design",
  "engineering",
  "machine-learning",
  "ai-overview",
  "product-demo",
  "log",
];

export type PostTag =
  | "design"
  | "engineering"
  | "machine-learning"
  | "ai-overview"
  | "product-demo"
  | "log";

export const renderTagStyle = (tag: PostTag) => {
  switch (tag) {
    case "design":
      return "!text-brand-orange border-brand-orange";
    case "engineering":
      return "!text-brand-crimson border-brand-crimson";
    case "machine-learning":
      return "!text-brand-plum border-brand-plum";
    case "ai-overview":
      return "!text-brand-violet border-brand-violet";
    case "product-demo":
      return "!text-brand-violet border-brand-violet";
    case "log":
      return "!text-brand-blue border-brand-blue";
    default:
      return null;
  }
};
