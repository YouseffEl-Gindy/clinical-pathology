import { login } from "@/app/_lib/actions/auth";
import { Button } from "@/app/_components/ui/Button";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";
import { TextField } from "@/app/_components/ui/FormField";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <form
        action={login}
        className={`w-full max-w-sm space-y-4 ${CARD_CLASS}`}
      >
        <h1 className="text-xl font-semibold">Log in</h1>

        <ErrorBanner message={error} />

        <TextField label="Email" name="email" type="email" required />
        <TextField label="Password" name="password" type="password" required />

        <Button className="w-full">Log in</Button>
      </form>
    </div>
  );
}
