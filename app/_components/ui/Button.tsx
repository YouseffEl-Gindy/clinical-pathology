type ButtonProps = React.ComponentProps<"button"> & {
  /** `md` for form submits, `sm` for buttons sitting inside a table row. */
  size?: "sm" | "md";
  /** `danger` is the borderless red text button used for destructive actions. */
  variant?: "primary" | "danger";
};

/**
 * The filled and outlined looks, and the padding each size uses.
 *
 * Exported because `LinkButton` renders a `next/link` that has to be visually
 * identical to a button — sharing the strings is what keeps them from drifting.
 */
export const BUTTON_PRIMARY =
  "rounded bg-gray-900 text-sm font-medium text-white hover:bg-gray-800";
export const BUTTON_SECONDARY =
  "rounded border border-gray-300 text-sm font-medium hover:bg-gray-50";
export const BUTTON_PADDING = { sm: "px-3 py-1", md: "px-3 py-2" } as const;

const DANGER = "text-sm text-red-600 hover:underline";
/** Shared by both variants so a disabled button reads as inert, not just unclickable. */
const DISABLED = "disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  size = "md",
  variant = "primary",
  className,
  type = "submit",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "danger"
      ? DANGER
      : `${BUTTON_PRIMARY} ${BUTTON_PADDING[size]}`;
  const base = `${variantClass} ${DISABLED}`;

  return (
    <button
      type={type}
      className={className ? `${base} ${className}` : base}
      {...props}
    />
  );
}
