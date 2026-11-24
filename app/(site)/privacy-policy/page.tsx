import { PageHero } from "@/components/sections/PageHero";
import { Markdown } from "@/components/sections/Markdown";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSettings } from "@/lib/content";

export const revalidate = 3600;

export async function generateMetadata() {
  return buildMetadata({ title: "Privacy Policy", description: "How Sourcing Eleven collects, uses and protects personal information submitted through this website.", path: "/privacy-policy" });
}

export default async function PrivacyPage() {
  const s = await getSettings();
  const contact = s.email ? `by emailing [${s.email}](mailto:${s.email})` : "through our [contact page](/contact)";
  const body = `This policy explains how ${s.companyName} ("we", "us") handles personal information submitted through this website.

## Information we collect

- **Enquiry details** you provide in the contact or quote forms: name, company, email, phone number, country, product details and messages.
- **Files** you attach to a quote request, such as technical packs or reference images.
- **Technical information** sent by your browser, such as IP address and user agent, used to protect the forms from abuse.
- **Analytics data**, only if you allow analytics cookies in the cookie banner.

## How we use it

We use enquiry details and files to respond to your enquiry, prepare quotations and coordinate sourcing work you ask us to carry out. We use technical information to prevent spam and abuse. With your consent, analytics data helps us understand how the site is used.

## Sharing

When you ask us to source a product, we may share relevant product information — not your personal contact details unless needed — with manufacturing partners in order to obtain quotations or samples. We use service providers for hosting, data storage and email delivery. We do not sell personal information.

## Storage and security

Enquiries and attachments are stored in access-controlled systems. Attachments are only available to authorised staff.

## Retention

We keep enquiry records for as long as needed to respond and to maintain a record of our business dealings, after which they are deleted.

## Your choices

You can ask us to access, correct or delete the personal information we hold about you ${contact}. You can change your analytics preference at any time using "Cookie settings" in the footer, where analytics is enabled.

## Changes

We may update this policy. The current version is always available on this page.`;
  return (
    <>
      <PageHero crumbs={[{ name: "Privacy Policy", path: "/privacy-policy" }]} title="Privacy policy" compact />
      <section className="section-y bg-white">
        <div className="container-x">
          <Markdown source={body} />
        </div>
      </section>
    </>
  );
}
