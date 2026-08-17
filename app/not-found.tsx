import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-gray-600">
          That page doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
