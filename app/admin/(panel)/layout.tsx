import { AdminShell } from "@/components/admin/AdminShell";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const [enquiries, quotes] = await Promise.all([store.list("enquiries"), store.list("quotes")]);
  return (
    <AdminShell
      user={{ name: session.name, email: session.email, role: session.role }}
      counts={{ enquiries: enquiries.filter((e) => e.status === "new").length, quotes: quotes.filter((q) => q.status === "new").length }}
    >
      {children}
    </AdminShell>
  );
}
