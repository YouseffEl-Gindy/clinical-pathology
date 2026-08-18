import { createAdminClient } from "@/app/_lib/supabase/admin";
import { getStaff } from "@/app/_lib/data/staff";
import { addStaff } from "@/app/_lib/actions/staff";
import { SubmitButton } from "@/app/_components/ui/SubmitButton";
import { CARD_CLASS } from "@/app/_components/ui/Card";
import { ErrorBanner } from "@/app/_components/ui/ErrorBanner";
import { SelectField, TextField } from "@/app/_components/ui/FormField";
import { Row, Table } from "@/app/_components/ui/Table";

export default async function StaffPage({
  searchParams,
}: PageProps<"/pathologist/staff">) {
  const { error } = await searchParams;
  const admin = createAdminClient();
  const staff = await getStaff(admin);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Staff</h1>

      <ErrorBanner message={error} />

      <form
        action={addStaff}
        className={`grid grid-cols-2 gap-4 ${CARD_CLASS}`}
      >
        <TextField
          label="Full name"
          name="full_name"
          type="text"
          required
          fieldClassName="col-span-2"
        />
        <TextField label="Email" name="email" type="email" required />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          minLength={6}
        />
        <SelectField
          label="Role"
          name="role"
          required
          defaultValue=""
          fieldClassName="col-span-2"
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="receptionist">Receptionist</option>
          <option value="sampler">Sampler</option>
          <option value="chemist">Chemist</option>
          <option value="pathologist">Pathologist</option>
        </SelectField>

        <SubmitButton className="col-span-2">Add staff</SubmitButton>
      </form>

      <Table
        headers={["Name", "Role", "Created"]}
        isEmpty={staff.length === 0}
        emptyMessage="No staff yet."
      >
        {staff.map((s) => (
          <Row key={s.id}>
            <td className="py-2">{s.full_name}</td>
            <td>{s.role}</td>
            <td>{new Date(s.created_at).toLocaleDateString()}</td>
          </Row>
        ))}
      </Table>
    </div>
  );
}
