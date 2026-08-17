import { Checkbox, Input, Select } from "@/app/_components/ui/Input";

/**
 * A labelled form control: the `space-y-1` wrapper + `<label>` + the control.
 *
 * `className` is applied to the wrapper, which is how fields opt into
 * `col-span-2` inside the two-column form grids.
 */
export function FormField({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ? `space-y-1 ${className}` : "space-y-1"}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

/** A labelled `<input>`. The field's `name` doubles as its `id`. */
export function TextField({
  label,
  name,
  fieldClassName,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  name: string;
  fieldClassName?: string;
}) {
  return (
    <FormField id={name} label={label} className={fieldClassName}>
      <Input id={name} name={name} {...props} />
    </FormField>
  );
}

/** A labelled `<select>`. The field's `name` doubles as its `id`. */
export function SelectField({
  label,
  name,
  fieldClassName,
  children,
  ...props
}: React.ComponentProps<"select"> & {
  label: string;
  name: string;
  fieldClassName?: string;
}) {
  return (
    <FormField id={name} label={label} className={fieldClassName}>
      <Select id={name} name={name} {...props}>
        {children}
      </Select>
    </FormField>
  );
}

/** A checkbox with its label to the right, as used across the questionnaire. */
export function CheckboxField({
  label,
  name,
  ...props
}: React.ComponentProps<"input"> & { label: string; name: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <Checkbox name={name} {...props} />
      {label}
    </label>
  );
}
