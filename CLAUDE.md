# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run Next.js linting
- `bun create-post` - Create a new blog post with interactive prompts

### Package Management

This project uses Bun as the package manager. Use `bun add` for dependencies and `bun install` to install packages.

## Architecture

### Tech Stack

- **Next.js 15** with App Router and Turbopack
- **TypeScript** with strict mode
- **TailwindCSS v4** with custom theme configuration
- **Content Collections** for type-safe MDX content management
- **Shadcn/UI** components built on Radix UI
- **Framer Motion** for animations

### Directory Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - Atomic design pattern:
  - `/atoms` - Base components (Button, Text, Link, SVG)
  - `/card` - Card components for content display
  - `/elements` - Composite UI elements
  - `/page` - Page-level components
  - `/mdx` - MDX-specific components
- `/posts` - MDX content files for blog posts
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions and configurations

### Content Architecture

All content is managed through MDX files with Content Collections. The schema is defined in `content-collections.ts` and provides:

- Type-safe frontmatter validation
- Automatic type generation
- Git-based last modified timestamps
- Reading time calculation
- Asset management with dimensions

## Critical Implementation Guidelines

### Media Rendering

- **Always use the canonical `Asset` type** from `src/types/content.ts`
- **Never create alternate versions** of the Asset type
- For MDX content: Use `ZoomableImage` and `ZoomableVideo` from `src/components/mdx/mdx-media.tsx`
- For UI components: Use type deduction: `NonNullable<Post["assets"]>[number]`
- Always specify aspect ratios as strings (e.g., "16-9")
- Use `MediaFigure` for semantic containers and `MediaWrapper` for consistent styling

### Next.js 15 Async Route Parameters

Route parameters are now async by default. Always implement as:

```typescript
// Correct pattern
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  // Use resolvedParams.slug
}
```

### Type System

- **Never create one-off types** - always use or extend types from `content-collections.ts`
- For posts/content types, defer to the Zod schema definitions
- Use proper type inference rather than duplicating type definitions

### Styling

- Use the custom `cn()` function from `src/lib/utils.ts` for className merging
- The project extends tailwind-merge to handle custom CSS variables
- Follow the established CSS variable naming patterns
- Use CSS clamp() for fluid typography with the `generateClampSize` utility

### Component Patterns

- Follow atomic design principles
- Export components through barrel exports (`index.ts`)
- Maintain consistent file naming conventions
- Use semantic HTML with proper ARIA attributes
- Implement error boundaries for robust error handling

## Content Management

- Posts are stored in `/posts` directory as MDX files
- Use `bun create-post` to scaffold new posts with proper frontmatter
- Assets should include width/height dimensions for proper rendering
- Categories: "writing", "projects", "library", "notes"
- Projects can have status: "active", "inactive", "archived"

## Environment & Deployment

- Deployed on Vercel
- Uses Bunny.net CDN for video hosting
- Analytics via Plausible
- OpenGraph image generation configured

## React Best Practices

Always try to follow the React best practices as defined in the following files:

- `.cursor/rules/react-guidelines-diceui.mdc`
- `.cursor/rules/react-patterns-diceui.mdc`
- `.cursor/rules/react-aiden-bai.mdc`
