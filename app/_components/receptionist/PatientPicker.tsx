import Link from "next/link";
import { PhoneSearchForm } from "@/app/_components/shared/PhoneSearchForm";
import { Row, Table } from "@/app/_components/ui/Table";
import type { Tables } from "@/app/_lib/types/database.types";

/**
 * Step one of creating a case: find the patient it belongs to.
 *
 * Selecting a patient just re-enters the new-case route with `?patientId=`,
 * which is what switches that page over to the questionnaire.
 */
export function PatientPicker({
  patients,
  phone,
}: {
  patients: Tables<"patients">[];
  phone?: string;
}) {
  return (
    <>
      <PhoneSearchForm defaultValue={phone} />

      <Table
        headers={["Name", "Phone", "DOB", ""]}
        isEmpty={patients.length === 0}
        emptyMessage={
          phone
            ? `No patients found for "${phone}".`
            : "Search for a patient by phone."
        }
      >
        {patients.map((p) => (
          <Row key={p.id}>
            <td className="py-2">
              {p.first_name} {p.last_name}
            </td>
            <td>{p.phone}</td>
            <td>{p.dob}</td>
            <td>
              <Link
                href={`/receptionist/cases/new?patientId=${p.id}`}
                className="text-sm text-gray-500 hover:underline"
              >
                Select
              </Link>
            </td>
          </Row>
        ))}
      </Table>
    </>
  );
}
