import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";
import { store } from "@/lib/database/store";
import { readFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

/** Authenticated download of quote attachments. Only keys attached to a stored quote can be fetched. */
export async function GET(_req: Request, ctx: RouteContext<"/api/admin/attachments/[...key]">) {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return new Response("Sign in to download attachments.", { status: 401 });

  const { key } = await ctx.params;
  const joined = key.map(decodeURIComponent).join("/");
  const quotes = await store.list("quotes");
  const attachment = quotes.flatMap((q) => q.attachments).find((a) => a.key === joined);
  if (!attachment) return new Response("Not found", { status: 404 });

  const file = await readFile("attachments", joined);
  if (!file) return new Response("File missing from storage", { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(attachment.name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
