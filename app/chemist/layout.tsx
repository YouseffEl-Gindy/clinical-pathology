import { requireRoleOrRedirect } from "@/app/_lib/auth/requireRoleOrRedirect";
import { PROCESSING_ROLES } from "@/app/_lib/constants";

export default async function ChemistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRoleOrRedirect(PROCESSING_ROLES);
  return children;
}
