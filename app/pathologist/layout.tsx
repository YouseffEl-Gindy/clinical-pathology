import { requireRoleOrRedirect } from "@/app/_lib/auth/requireRoleOrRedirect";
import { ADMIN_ROLES } from "@/app/_lib/constants";

export default async function PathologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRoleOrRedirect(ADMIN_ROLES);
  return children;
}
