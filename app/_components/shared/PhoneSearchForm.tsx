import { Button } from "@/app/_components/ui/Button";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { Input } from "@/app/_components/ui/Input";

/**
 * Phone-number search box. A plain GET form — submitting it puts `?phone=` on
 * the current route, which the page reads back out of its search params.
 */
export function PhoneSearchForm({
  placeholder = "Search by phone number",
  defaultValue,
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <form className={`flex gap-2 ${CARD_CLASS}`}>
      <Input
        name="phone"
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
      <Button>Search</Button>
    </form>
  );
}
