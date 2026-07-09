/**
 * Bare layout for auth screens — no admin sidebar. Placing /admin/login in its
 * own route group keeps it from inheriting app/(admin)/layout.tsx.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full items-center justify-center bg-cream px-4 py-16">
      {children}
    </div>
  );
}
