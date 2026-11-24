import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/layout/Logo";
import { getSession } from "@/lib/auth/guard";
import { getAdminUsers } from "@/lib/auth/users";
import { getSessionSecret } from "@/lib/auth/session";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getSession()) redirect("/admin");
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "";
  const configured = getAdminUsers().length > 0 && Boolean(getSessionSecret());

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="on-dark relative hidden overflow-hidden bg-navy-deep lg:block">
        <svg aria-hidden="true" viewBox="0 0 800 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M-60 900 C 120 200, 680 200, 860 900" fill="none" stroke="#C7A365" strokeOpacity="0.5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative flex h-full flex-col justify-between p-14">
          <div className="w-56">
            <Logo tone="light" variant="lockup" sizes="224px" />
          </div>
          <p className="font-serif-display max-w-md text-[2.75rem] leading-[1.1] text-ivory">Content, enquiries and quotes — all in one place.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 w-48 lg:hidden">
            <Logo tone="dark" sizes="192px" />
          </div>
          <h1 className="font-serif-display text-[2.5rem] leading-tight text-navy">Sign in</h1>
          <p className="mt-2 text-muted-strong">Admin access for the Sourcing Eleven team.</p>
          {configured ? (
            <LoginForm next={next} />
          ) : (
            <div className="mt-8 rounded-card border border-danger/30 bg-danger/5 p-5 text-sm text-danger">
              Admin sign-in isn&apos;t configured on this server yet. Set <code>SESSION_SECRET</code> and <code>ADMIN_EMAIL</code> + <code>ADMIN_PASSWORD_HASH</code> (or <code>ADMIN_USERS</code>) — see the deployment guide.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
