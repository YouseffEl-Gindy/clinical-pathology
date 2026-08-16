import { redirect } from "next/navigation";
import { createClient } from "@/app/_lib/supabase/server";
import { getMyRole } from "@/app/_lib/data/profiles";

export default async function ChemistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const role = await getMyRole(supabase);

  if (role !== "chemist" && role !== "pathologist") {
    redirect("/");
  }

  return children;
}
