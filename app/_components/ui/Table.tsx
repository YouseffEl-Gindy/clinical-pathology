/**
 * The plain bordered table used by every list in the app.
 *
 * `headers` may contain empty strings for action columns. When `isEmpty` is
 * true a full-width placeholder row is rendered after `children`.
 */
export function Table({
  headers,
  isEmpty,
  emptyMessage,
  children,
}: {
  headers: string[];
  isEmpty?: boolean;
  emptyMessage?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500">
          {headers.map((header, i) => (
            <th key={i} className={i === 0 ? "py-2" : undefined}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
        {isEmpty && (
          <tr>
            <td
              colSpan={headers.length}
              className="py-4 text-center text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

/** One body row. Its first cell should carry `className="py-2"`. */
export function Row({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-gray-100">{children}</tr>;
}
