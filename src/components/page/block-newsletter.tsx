import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Button, Text } from "@/components/atoms";

type NewsletterSubscribeProps = {
  className?: string;
  label?: string;
  showLabel?: boolean;
};

/* Width is the caller's business — every call site already sits inside a container. */
export const NewsletterSubscribe = ({
  className,
  label = "Get notified of new stuff on Callum's website.",
  showLabel = true,
}: NewsletterSubscribeProps) => (
  <section
    data-component="NewsletterSubscribe"
    aria-labelledby="newsletter-subscribe-label"
    className={className}
  >
    <div className="space-y-gap">
      {showLabel && (
        <Text
          as="p"
          className="text-pretty"
          color="solid"
          id="newsletter-subscribe-label"
          intent="meta"
        >
          {label}
        </Text>
      )}
      {/*
       * SUBSTACK HANDOFF
       *
       * We own and style this form, then hand the reader to Substack's hosted
       * /subscribe page with their email prefilled. This avoids Substack's
       * supported iframe, which Substack says cannot be customized:
       * https://support.substack.com/hc/en-us/articles/360041759232
       *
       * Tradeoffs:
       * - The /subscribe page is public and documented; its `email` prefill
       *   query parameter is not a documented API contract.
       * - The email appears in the destination URL and browser history.
       * - The reader must still confirm on Substack, where Substack branding,
       *   plan selection, recommendations, and consent flows are owned.
       * - Do not replace this with a POST to /api/v1/free: that endpoint is
       *   undocumented for third-party integrations and is more likely to
       *   change or gain anti-abuse requirements.
       *
       * Maintenance: periodically submit a test address and confirm the new
       * tab opens /subscribe with the email populated. If prefill stops
       * working, keep the branded boundary off-site and fall back to linking
       * to /subscribe without passing the email.
       */}
      <form
        action="https://thelittoralline.substack.com/subscribe"
        className="flex"
        method="get"
        rel="noopener noreferrer"
        target="_blank"
      >
        <input
          aria-label="Email address"
          autoComplete="email"
          className="border-solid-light focus-visible:border-fill text-meta placeholder:text-solid px-w4 h-button min-w-0 flex-1 border bg-transparent pb-[0.2em] outline-none focus:z-10"
          name="email"
          placeholder="Email address"
          required
          type="email"
        />
        <Button
          className="-ml-px w-fit"
          size="sm"
          SuffixIcon={<ArrowRightIcon />}
          type="submit"
        >
          Subscribe
        </Button>
      </form>
    </div>
  </section>
);
