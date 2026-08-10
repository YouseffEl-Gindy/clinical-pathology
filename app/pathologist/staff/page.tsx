import { createAdminClient } from "@/app/_lib/supabase/admin";
import { getStaff } from "@/app/_lib/data/staff";
import { addStaff } from "@/app/_lib/actions/staff";

export default async function StaffPage({
  searchParams,
}: PageProps<"/pathologist/staff">) {
  const { error } = await searchParams;
  const admin = createAdminClient();
  const staff = await getStaff(admin);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Staff</h1>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={addStaff}
        className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <div className="col-span-2 space-y-1">
          <label htmlFor="full_name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue=""
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="receptionist">Receptionist</option>
            <option value="sampler">Sampler</option>
            <option value="chemist">Chemist</option>
            <option value="pathologist">Pathologist</option>
          </select>
        </div>

        <button
          type="submit"
          className="col-span-2 rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add staff
        </button>
      </form>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2">Name</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="border-b border-gray-100">
              <td className="py-2">{s.full_name}</td>
              <td>{s.role}</td>
              <td>{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {staff.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-gray-500">
                No staff yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
