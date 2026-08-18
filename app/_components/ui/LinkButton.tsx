import Link from "next/link";
import {
  BUTTON_PADDING,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
} from "@/app/_components/ui/Button";

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  /** `md` for standalone buttons, `sm` for ones sitting inside a table row. */
  size?: "sm" | "md";
  /** `secondary` is the outlined look used for navigation that isn't the main action. */
  variant?: "primary" | "secondary";
};

/**
 * A navigation link that looks like a `Button`.
 *
 * It's a link, not a button, so the click is a real navigation: the nearest
 * `loading.tsx` covers the wait. Never use `SubmitButton` for this — that one is
 * for server actions that stay on the page.
 */
export function LinkButton({
  size = "md",
  variant = "primary",
  className,
  ...props
}: LinkButtonProps) {
  const base = `inline-block ${
    variant === "secondary" ? BUTTON_SECONDARY : BUTTON_PRIMARY
  } ${BUTTON_PADDING[size]}`;

  return <Link className={className ? `${base} ${className}` : base} {...props} />;
}
