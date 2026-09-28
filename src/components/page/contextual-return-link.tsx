import { ReturnLink } from "./return-link";

export interface ReturnSearchParams {
  from?: string | string[];
}

export async function ContextualReturnLink({
  searchParams,
}: {
  searchParams: Promise<ReturnSearchParams>;
}) {
  const { from } = await searchParams;
  const source = Array.isArray(from) ? from[0] : from;

  return source === "writing" ? (
    <ReturnLink href="/writing" label="Writing" />
  ) : (
    <ReturnLink />
  );
}
