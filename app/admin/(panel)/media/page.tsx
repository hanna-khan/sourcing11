import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminShell";
import { EmptyState, Panel } from "@/components/admin/ui";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyButton } from "@/components/admin/CopyButton";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteMediaAction, updateMediaAltAction } from "@/app/admin/actions";
import { requireSession } from "@/lib/auth/guard";
import { store } from "@/lib/database/store";
import { imageKeys, images } from "@/data/images";
import { formatBytes, formatDate } from "@/lib/utils/format";

export const metadata = { title: "Media library" };

export default async function MediaPage() {
  await requireSession();
  const media = (await store.list("media")).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return (
    <>
      <AdminHeader title="Media library" intro="Upload website images, then select them in any image field. Uploaded images are public once used on a page." />
      <Panel title="Upload an image" className="mb-8">
        <MediaUploader />
      </Panel>

      <h2 className="mb-4 text-lg font-semibold text-navy">Uploaded images</h2>
      {media.length === 0 ? (
        <EmptyState title="No uploads yet" body="Upload photography of real products, materials or your team to replace the built-in material studies." />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {media.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-card border border-line bg-white">
              <div className="relative aspect-[4/3] bg-ivory">
                <Image src={m.url} alt={m.alt} fill sizes="(min-width: 1280px) 25vw, 45vw" className="object-cover" />
              </div>
              <div className="space-y-3 p-5">
                <p className="truncate text-sm font-semibold text-navy">{m.name}</p>
                <p className="text-xs text-muted-strong">
                  {formatBytes(m.size)} · {formatDate(m.createdAt, { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <form action={updateMediaAltAction.bind(null, m.id)} className="flex gap-2">
                  <label htmlFor={`alt-${m.id}`} className="sr-only">
                    Alt text for {m.name}
                  </label>
                  <input id={`alt-${m.id}`} name="alt" defaultValue={m.alt} className="min-h-10 min-w-0 flex-1 rounded-field border border-line px-3 text-sm" />
                  <button type="submit" className="rounded-pill border border-navy/25 px-3 text-sm font-semibold text-navy">
                    Save
                  </button>
                </form>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <CopyButton value={m.url} />
                  <ConfirmButton action={deleteMediaAction.bind(null, m.id)} label="Delete" className="min-h-9 px-4" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-2 mt-14 text-lg font-semibold text-navy">Built-in image library</h2>
      <p className="mb-6 max-w-2xl text-sm text-muted-strong">Procedurally rendered textile material studies included with the site. Replace the files in <code>public/images</code> with licensed photography using the same filenames to update them everywhere.</p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-6">
        {imageKeys.map((k) => (
          <li key={k} className="overflow-hidden rounded-card border border-line bg-white">
            <div className="relative aspect-square bg-ivory">
              <Image src={images[k].src} alt={images[k].alt} fill sizes="200px" className="object-cover" />
            </div>
            <p className="truncate px-3 py-2 font-mono text-xs text-navy">{k}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
