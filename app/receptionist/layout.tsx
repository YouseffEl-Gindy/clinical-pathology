import { requireRoleOrRedirect } from "@/app/_lib/auth/requireRoleOrRedirect";
import { RECEPTION_ROLES } from "@/app/_lib/constants";

export default async function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRoleOrRedirect(RECEPTION_ROLES);
  return children;
}
