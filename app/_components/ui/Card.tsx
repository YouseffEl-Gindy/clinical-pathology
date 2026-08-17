/**
 * The panel look used for every bordered box in the app.
 *
 * Exported as a bare class string as well as a component, because roughly half
 * the call sites need it on a `<form>` or `<dl>` rather than a `<div>` and
 * compose extra layout classes alongside it.
 */
export const CARD_CLASS = "rounded-lg border border-gray-200 p-6 shadow-sm";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `${CARD_CLASS} ${className}` : CARD_CLASS}>
      {children}
    </div>
  );
}
