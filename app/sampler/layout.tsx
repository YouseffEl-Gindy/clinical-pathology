import { requireRoleOrRedirect } from "@/app/_lib/auth/requireRoleOrRedirect";
import { SAMPLING_ROLES } from "@/app/_lib/constants";

export default async function SamplerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRoleOrRedirect(SAMPLING_ROLES);
  return children;
}
