import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <ThemeToggle className="absolute top-4 right-4" />
      {children}
    </div>
  );
}
