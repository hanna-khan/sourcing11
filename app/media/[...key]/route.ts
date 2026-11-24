import { readFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

/** Public delivery for images uploaded through the admin media library. */
export async function GET(_req: Request, ctx: RouteContext<"/media/[...key]">) {
  const { key } = await ctx.params;
  const joined = key.map(decodeURIComponent).join("/");
  if (joined.includes("..")) return new Response("Not found", { status: 404 });
  const file = await readFile("media", joined);
  if (!file || !file.contentType.startsWith("image/")) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
