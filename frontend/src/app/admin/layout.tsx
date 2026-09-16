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
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Consultations", href: "/admin/consultations" },
  { label: "Office", href: "/admin/office" },
  { label: "Settings", href: "/admin/settings" },
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Login page does not need authentication checking
    if (isLoginPage) {
      return;
    }

    const timer = window.setTimeout(() => {
      const authenticated = adminAuthApi.isAuthenticated();

      if (!authenticated) {
        setIsAuthenticated(false);
        router.replace("/admin/login");
        return;
      }

      setIsAuthenticated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isLoginPage, router]);

  // Login page should not show the admin dashboard shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authentication is still being checked
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2]">
        <p className="text-base font-medium text-[#171614]">
          Checking admin authentication...
        </p>
      </div>
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f2]">
        <p className="text-base font-medium text-[#171614]">
          Redirecting to login...
        </p>
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
    <div className="min-h-screen bg-[#f7f5f2] text-[#171614]">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#393632] bg-[#24221f] lg:block">
          <div className="sticky top-0 flex h-screen flex-col">

            {/* Logo */}
            <div className="border-b border-[#45413b] px-6 py-6">
              <Link
                href="/admin"
                className="text-xl font-bold tracking-tight text-white"
              >
                Interior Admin
              </Link>

              <p className="mt-1 text-xs font-medium text-[#d6d1ca]">
                Management Panel
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-5">
              <div className="space-y-1.5">
                {navigation.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-white text-[#171614] shadow-sm"
                          : "text-[#e7e3dd] hover:bg-[#37332e] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Sidebar Logout */}
            <div className="border-t border-[#45413b] p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg border border-[#716b63] bg-transparent px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#aaa298] hover:bg-[#37332e]"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#f7f5f2]">

          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-[#ded9d1] bg-white">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">

              <h1 className="text-lg font-semibold text-[#171614]">
                Admin Panel
              </h1>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[#c9c3ba] bg-white px-3 py-2 text-sm font-semibold text-[#24221f] transition hover:bg-[#f3f0eb]"
              >
                Logout
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="overflow-x-auto border-t border-[#ebe7e1] bg-white lg:hidden">
              <nav className="flex min-w-max gap-2 p-3">
                {navigation.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[#24221f] text-white"
                          : "bg-[#f0ede8] text-[#302e2a] hover:bg-[#e5e0d8]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-73px)] flex-1 bg-[#f7f5f2] p-4 text-[#171614] lg:p-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}