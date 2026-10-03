"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { adminAuthApi } from "@/lib/api";

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  { label: "Dashboard", href: "/admin" },
  { label: "Designs", href: "/admin/designs" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Services", href: "/admin/services" },
  { label: "About", href: "/admin/about" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Office", href: "/admin/office" },
];

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  // null = checking
  // true = authenticated
  // false = not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    const checkAuthentication = () => {
      const authenticated = adminAuthApi.isAuthenticated();

      if (!authenticated) {
        setIsAuthenticated(false);
        router.replace("/admin/login");
        return;
      }

      setIsAuthenticated(true);
    };

    const timer = window.setTimeout(checkAuthentication, 0);

    window.addEventListener("admin-auth-changed", checkAuthentication);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(
        "admin-auth-changed",
        checkAuthentication
      );
    };
  }, [isLoginPage, router]);

  // Login page should not show the admin dashboard shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authentication is still being checked
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5EFE3] px-6">
        <div className="w-full max-w-sm rounded-lg border border-[#D8C9A8] bg-[#FFFDF8] p-8 text-center shadow-sm">
          <div className="mx-auto h-1 w-12 rounded-full bg-[#B8892D]" />

          <p className="mt-6 text-sm font-medium text-[#4F5B2A]">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5EFE3] px-6">
        <div className="w-full max-w-sm rounded-lg border border-[#D8C9A8] bg-[#FFFDF8] p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-[#4F5B2A]">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    adminAuthApi.logout();
    setIsAuthenticated(false);
    router.replace("/admin/login");
  };

  const isActive = (href: string) => {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F5EFE3] text-[#24211D]">
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 lg:block">
        <div className="flex h-full flex-col bg-[#4F5B2A]">
          {/* Brand */}
          <div className="shrink-0 border-b border-white/10 px-7 py-7">
            <Link href="/admin" className="block">
              <p className="font-(--font-display) text-2xl leading-none text-[#D8C9A8]">
                Interior Studio
              </p>

              <p className="mt-2 text-xl font-semibold tracking-tight text-white">
                Admin
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-7">
            <div className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "bg-[#FFFDF8] text-[#4F5B2A]"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-2 left-0 top-2 w-0.5 bg-[#B8892D]" />
                    )}

                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Account */}
          <div className="shrink-0 border-t border-white/10 p-5">
            <div className="mb-4">
              <p className="text-sm font-medium text-white">
                Administrator
              </p>

              <p className="mt-1 text-xs text-white/50">
                Studio administration
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:border-[#D8C9A8] hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Right Side */}
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="relative z-20 shrink-0 border-b border-[#D8C9A8] bg-[#FFFDF8]">
          <div className="flex min-h-18 items-center justify-between px-4 sm:px-6 lg:px-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#B8892D]">
                Interior Studio
              </p>

              <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#3F491F]">
                Admin
              </h1>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-md border border-[#CFC5B4] bg-[#FFFDF8] px-4 py-2 text-sm font-medium text-[#4F5B2A] transition-colors duration-200 hover:border-[#B8892D] hover:bg-[#F5EFE3] sm:block"
            >
              Logout
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="border-t border-[#E3DCCF] bg-[#F5EFE3] lg:hidden">
            <nav className="flex gap-1 overflow-x-auto px-4 py-2.5">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-md px-3.5 py-2 text-xs font-medium transition-colors duration-200 ${
                      active
                        ? "bg-[#4F5B2A] text-white"
                        : "bg-[#FFFDF8] text-[#756F67] hover:text-[#4F5B2A]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Single Page Scroll Area */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#F5EFE3]">
          <div className="mx-auto w-full min-w-0 max-w-360 p-4 sm:p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}