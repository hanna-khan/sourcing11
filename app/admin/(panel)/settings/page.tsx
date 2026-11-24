import { AdminHeader } from "@/components/admin/AdminShell";
import { Panel } from "@/components/admin/ui";
import { SimpleActionForm } from "@/components/admin/SimpleActionForm";
import { saveSettingsAction } from "@/app/admin/actions";
import { requireSession } from "@/lib/auth/guard";
import { getSettings } from "@/lib/content";
import { pairsToText } from "@/lib/admin/collections";
import { worldMap } from "@/data/world-map";

export const metadata = { title: "Website settings" };

const input = "block w-full rounded-field border border-line bg-white px-4 py-3 text-[0.9375rem] focus:border-navy focus:outline-none";

function Field({ name, label, value, hint, textarea, type = "text" }: { name: string; label: string; value: string; hint?: string; textarea?: boolean; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-navy">
        {label}
      </label>
      {textarea ? <textarea id={name} name={name} defaultValue={value} rows={4} className={input} /> : <input id={name} name={name} type={type} defaultValue={value} className={input} />}
      {hint && <p className="mt-1.5 text-xs text-muted-strong">{hint}</p>}
    </div>
  );
}

export default async function SettingsPage() {
  await requireSession("admin");
  const s = await getSettings();
  const marketOptions = Object.entries(worldMap.markets).filter(([k]) => k !== "pakistan");

  return (
    <>
      <AdminHeader title="Website settings" intro="Business details shown across the website and in structured data. Empty fields are hidden on the public site — never enter details that aren't confirmed." />
      <SimpleActionForm action={saveSettingsAction} submitLabel="Save settings" className="max-w-4xl space-y-8">
        <Panel title="Brand">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="companyName" label="Company name" value={s.companyName} />
            <Field name="tagline" label="Tagline" value={s.tagline} />
            <div className="sm:col-span-2">
              <Field name="shortIntro" label="Short introduction (footer)" value={s.shortIntro} textarea />
            </div>
            <Field name="foundingYear" label="Founding year" value={s.foundingYear} hint="Four digits. Used in structured data only when set." />
          </div>
        </Panel>
        <Panel title="Contact details">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="email" label="Public email" value={s.email} type="email" />
            <Field name="phone" label="Phone" value={s.phone} hint="International format, e.g. +92 …" />
            <Field name="whatsapp" label="WhatsApp number" value={s.whatsapp} hint="International format with country code. Powers the WhatsApp links." />
            <Field name="businessHours" label="Business hours" value={s.businessHours} hint="e.g. Monday–Saturday, 9:00–18:00 PKT" />
            <div className="sm:col-span-2">
              <Field name="address" label="Business address" value={s.address} textarea />
              <label className="mt-3 flex items-center gap-3 text-sm font-semibold text-navy">
                <input type="checkbox" name="addressVerified" defaultChecked={s.addressVerified} className="h-5 w-5 accent-[var(--color-navy)]" />
                Address is verified and may be shown publicly with a map link
              </label>
            </div>
          </div>
        </Panel>
        <Panel title="Social profiles">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="linkedin" label="LinkedIn URL" value={s.linkedin} />
            <Field name="instagram" label="Instagram URL" value={s.instagram} />
            <Field name="facebook" label="Facebook URL" value={s.facebook} />
            <Field name="x" label="X (Twitter) URL" value={s.x} />
          </div>
        </Panel>
        <Panel title="Map markets">
          <fieldset>
            <legend className="mb-3 text-sm text-muted-strong">Buyer markets highlighted on the homepage map. Pakistan is always shown as the sourcing base.</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {marketOptions.map(([k, m]) => (
                <label key={k} className="flex items-center gap-3 rounded-field border border-line px-3 py-2.5 text-sm">
                  <input type="checkbox" name="markets" value={k} defaultChecked={s.markets.includes(k)} className="h-4 w-4 accent-[var(--color-navy)]" />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>
        </Panel>
        <Panel title="Verified statistics and team">
          <div className="grid gap-6">
            <div>
              <label htmlFor="stats" className="mb-2 block text-sm font-semibold text-navy">
                Statistics (verified only)
              </label>
              <textarea id="stats" name="stats" defaultValue={pairsToText(s.stats)} rows={4} className={`${input} font-mono text-sm`} />
              <p className="mt-1.5 text-xs text-muted-strong">One per line: value :: label — e.g. “12+ :: Years in textile sourcing”. Leave empty to hide the animated counters. Only enter figures you can evidence.</p>
            </div>
            <div>
              <label htmlFor="team" className="mb-2 block text-sm font-semibold text-navy">
                Team members
              </label>
              <textarea id="team" name="team" defaultValue={pairsToText(s.team)} rows={4} className={`${input} font-mono text-sm`} />
              <p className="mt-1.5 text-xs text-muted-strong">One per line: Name :: Role. Shown on the About page when filled in.</p>
            </div>
          </div>
        </Panel>
      </SimpleActionForm>
    </>
  );
}
