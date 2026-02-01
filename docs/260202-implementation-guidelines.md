# Implementation guidelines

## Media rendering

- Always use the canonical `Asset` type from `src/types/content.ts`
- Never create alternate versions of the Asset type
- For MDX content: Use `ZoomableImage` and `ZoomableVideo` from `src/components/mdx/mdx-media.tsx`
- For UI components: Use type deduction: `NonNullable<Post["assets"]>[number]`
- Always specify aspect ratios as strings (e.g., "16-9")
- Use `MediaFigure` for semantic containers and `MediaWrapper` for consistent styling

## Next.js 15 async route parameters

Route parameters are async by default. Always implement as:

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  // Use resolvedParams.slug
}
```

## Type system

- Never create one-off types - always use or extend types from `content-collections.ts`
- For posts/content types, defer to the Zod schema definitions
- Use proper type inference rather than duplicating type definitions

## Styling

- Use the custom `cn()` function from `src/lib/utils.ts` for className merging
- The project extends tailwind-merge to handle custom CSS variables
- Follow the established CSS variable naming patterns
- Use CSS clamp() for fluid typography with the `generateClampSize` utility

## Component patterns

- Follow atomic design principles
- Export components through barrel exports (`index.ts`)
- Maintain consistent file naming conventions
- Use semantic HTML with proper ARIA attributes
- Implement error boundaries for robust error handling
