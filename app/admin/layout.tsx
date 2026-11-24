import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Sourcing Eleven admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="on-light min-h-screen bg-ivory text-ink">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
