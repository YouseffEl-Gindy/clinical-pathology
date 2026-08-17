/** The single border/padding treatment shared by every text input and select. */
export const INPUT_CLASS =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm";

/** The smaller checkbox treatment used in the questionnaire and test pickers. */
export const CHECKBOX_CLASS = "h-4 w-4 rounded border-gray-300";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={className ? `${INPUT_CLASS} ${className}` : INPUT_CLASS}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={className ? `${INPUT_CLASS} ${className}` : INPUT_CLASS}
      {...props}
    />
  );
}

export function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={className ? `${CHECKBOX_CLASS} ${className}` : CHECKBOX_CLASS}
      {...props}
    />
  );
}
