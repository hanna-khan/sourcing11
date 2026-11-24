import { PageHero } from "@/components/sections/PageHero";
import { Markdown } from "@/components/sections/Markdown";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 86400;

export async function generateMetadata() {
  return buildMetadata({ title: "Terms of Use", description: "The terms that apply when you use the Sourcing Eleven website, submit an enquiry or request a quotation.", path: "/terms" });
}

const body = `These terms apply to your use of this website. Sourcing agreements for specific orders are made separately in writing.

## Information on this site

The content on this website is general information about our services and about textile sourcing. It is not a quotation, a contract or professional advice for your specific circumstances. We aim to keep it accurate and current, but we do not guarantee that it is complete or error-free.

## Our role

Sourcing Eleven is a buying and sourcing agency. We do not own manufacturing facilities. Products are manufactured by independent partners, and the terms of any order — including price, specifications, quality standards and delivery — are agreed in writing for each project.

## Enquiries and quotations

Submitting a contact or quote form does not create a contract. Any indication of price, minimum order quantity or lead time is subject to confirmation once specifications are agreed.

## Intellectual property

The website design, text and graphics belong to Sourcing Eleven unless stated otherwise. Information you send us, such as designs and technical packs, remains yours; we use it only to respond to your enquiry and carry out the work you ask us to do.

## Acceptable use

Do not misuse the website, including by attempting to gain unauthorised access, submitting malicious files or sending unsolicited bulk messages through its forms.

## Links

Links to other websites are provided for convenience. We are not responsible for their content.

## Changes

We may update these terms. The current version is always available on this page.`;

export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Terms of Use", path: "/terms" }]} title="Terms of use" compact />
      <section className="section-y bg-white">
        <div className="container-x">
          <Markdown source={body} />
        </div>
      </section>
    </>
  );
}
