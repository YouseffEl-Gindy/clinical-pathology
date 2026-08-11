import { addPatient } from "@/app/_lib/actions/patients";

export default async function NewPatientPage({
  searchParams,
}: PageProps<"/receptionist/patients/new">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <h1 className="text-xl font-semibold">Register Patient</h1>

      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        action={addPatient}
        className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-6 shadow-sm"
      >
        <div className="space-y-1">
          <label htmlFor="first_name" className="text-sm font-medium">
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="last_name" className="text-sm font-medium">
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dob" className="text-sm font-medium">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            required
            defaultValue=""
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="marital_status" className="text-sm font-medium">
            Marital status
          </label>
          <input
            id="marital_status"
            name="marital_status"
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="residence" className="text-sm font-medium">
            Residence
          </label>
          <input
            id="residence"
            name="residence"
            type="text"
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
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label htmlFor="referral_source" className="text-sm font-medium">
            Referral source
          </label>
          <input
            id="referral_source"
            name="referral_source"
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Register patient
        </button>
      </form>
    </div>
  );
}
