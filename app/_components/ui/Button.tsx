type ButtonProps = React.ComponentProps<"button"> & {
  /** `md` for form submits, `sm` for buttons sitting inside a table row. */
  size?: "sm" | "md";
  /** `danger` is the borderless red text button used for destructive actions. */
  variant?: "primary" | "danger";
};

const PRIMARY = "rounded bg-gray-900 text-sm font-medium text-white hover:bg-gray-800";
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
      : `${PRIMARY} ${size === "sm" ? "px-3 py-1" : "px-3 py-2"}`;
  const base = `${variantClass} ${DISABLED}`;

  return (
    <button
      type={type}
      className={className ? `${base} ${className}` : base}
      {...props}
    />
  );
}
