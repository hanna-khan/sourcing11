# Sourcing Eleven — design system

Implemented in `app/globals.css` (Tailwind 4 `@theme` tokens) and the components in `/components`. This document describes what the code does.

## Brand identity

**Premium corporate + luxury editorial + modern industrial.** One idea carries the whole system: **the bridge**. The thin golden arc from the logo is the recurring structural device — section dividers, hero line drawings, the journey timeline, map connections, breadcrumb separators, the arched image frames and the kicker mark. The arc is used where it means something (a connection, a progression); it is not sprinkled as decoration.

Tagline: **Your Bridge from Concept to Shipment.**

## Logo usage

- Official artwork (supplied): `public/logo/source/SOURCING11_Concept07_ArcOver_{transparent,on-navy}.png`. Never edit these.
- Derived, unaltered crops: `sourcing11-logo{,-light}.png` (arc + wordmark) and `sourcing11-lockup{,-light}.png` (with tagline). Light variants use the exact colours of the supplied on-navy file.
- Component: `components/layout/Logo.tsx` — `tone="light"` on navy, `tone="dark"` on light, `variant="mark" | "lockup"`, `decorative` inside labelled links.
- Favicon / app icon: the logo's gold "11" on navy (`app/icon.png`, `app/apple-icon.png`, `public/logo/icon-512.png`).
- Clear space: at least the arc's height on all sides. Minimum width: 140 px. Never recolour, stretch or redraw.
- On the homepage the large hero logo "hands off" to the header logo once the visitor scrolls.

## Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| `navy` | `#0B1F39` | Heroes, feature sections |
| `navy-deep` | `#07172B` | Footer, cinematic sections, overlays |
| `navy-soft` | `#16304F` | Hover on dark buttons, map land |
| `gold` | `#C7A365` | Arcs, primary buttons, focus rings, highlights |
| `gold-soft` | `#D8BC8C` | Text accents on navy |
| `gold-ink` | `#8A6A33` | **Gold text on light backgrounds** (4.9:1 on white) |
| `ivory` | `#F7F5F0` | Editorial sections, text on navy |
| `white` | `#FFFFFF` | Galleries, services, forms |
| `ink` | `#202B38` | Primary text |
| `muted` | `#77818D` | Large/secondary text only (4.0:1 on white) |
| `muted-strong` | `#5C6672` | **Small secondary text** (5.6:1 on white) |
| `line` | `#E7E5DF` | Borders on light |
| `danger` / `success` | `#A23B2C` / `#2F6B4F` | Form states |

Rules: never set `gold` text on white or ivory (2.3:1) — use `gold-ink`. Pages alternate navy and light sections; the site is never wholly dark.

## Typography

- **Manrope** (variable 200–800): navigation, body, buttons, UI.
- **Cormorant Garamond 500**: display and editorial headings (`.font-serif-display`), pull quotes. Only this weight is shipped.
- Fluid scale (`clamp`): `display` 46→112 px · `h1` 40→80 · `h2` 32→60 · `h3` 22→30 · `lead` 18→22 · `body` 17 px / 1.7.
- Body line length is held under ~75 characters (`max-w-xl` / `max-w-2xl`, prose 42 rem).
- Avoided on purpose: all-caps eyebrow labels, single-word italic accents in headlines. Kickers are sentence case with the arc mark.

## Spacing, grid and containers

- Container: `max-width: 90rem`, gutter `clamp(1.25rem, 4vw, 4.5rem)` (`.container-x`).
- Section rhythm: `--section-y: clamp(5rem, 3.5rem + 7vw, 11rem)` (`.section-y`).
- 12-column grid at `lg`; asymmetric 5/6–7 splits for editorial layouts.
- Tailwind's 4 px spacing scale for everything else.

## Breakpoints

`xs` 400 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536 · `3xl` 1792 px. Layouts are recomposed per breakpoint (mobile hero, mobile journey, swipeable galleries, stacked forms), not just shrunk.

## Radius and shadows

Radius follows hierarchy, not one value for everything: `pill` (buttons, chips), `card` 6 px (panels), `field` 8 px (inputs), `media` 3 px (photography), and full arches (`rounded-t-[999px]`) for feature images. Shadows: `lift` (floating media), `panel` (menus, dialogs, toasts). No gradient washes as decoration.

## Components

| Group | Components |
| --- | --- |
| Layout | `SiteHeader` (transparent → white, hides on scroll down), desktop mega menus, full-screen mobile dialog, `SiteFooter`, `ScrollChrome` (progress line + back to top), `PageTransition` |
| Sections | `PageHero`, `SectionHeading`, `CtaBand`, `ProcessSteps`, `BenefitList`, `RelatedCards` / `ImageCard`, `HorizontalGallery`, `LightboxGallery`, `Markdown` |
| Home | `Hero` + `FabricCanvas` (3D), `Introduction`, `ServicesShowcase`, `CategoriesShowcase`, `Journey`, `WhyUs`, `PartnerNetwork`, `WorldMap` + `MapMarkers`, `InsightsPreview` |
| UI | `LinkButton` / `Button` / `TextLink` (5 variants), `Breadcrumbs` (+ schema), `Accordion`, `Tabs`, `Pagination`, `Toast`, empty and loading states |
| Forms | `TextField`, `TextArea`, `SelectField`, `Checkbox`, `FileUpload`, `SpamFields`, `Turnstile`, `ContactForm`, `QuoteForm` (4 steps) |

### Buttons

`gold` (primary on navy), `dark` (primary on light), `light`, `outline-light`, `outline-dark`. Minimum 48 px tall, pill radius, arrow that nudges on hover, magnetic drift on fine pointers.

### Form fields

Visible label above every field, "Optional" marker, hint text, inline error with icon linked by `aria-describedby`, gold focus ring. Errors are plain language ("Enter your full name."), validated with the same Zod schema in the browser and on the server.

## Image treatments

Arched frames for hero and feature imagery; slow 1.4 s zoom on hover; mask-wipe reveal on scroll; navy gradients only where text sits on images. All imagery comes from `data/images.ts` with descriptive alt text.

## Motion principles

One motion language: `--ease-silk` (`cubic-bezier(.22,1,.36,1)`), 0.9–1.4 s for reveals, arc drawing as the signature move.

- **Above the fold**: pure CSS entrances (`.enter`, `.enter-words`, `.enter-media`, `.hero-in`, `.hero-draw`, `.hero-pop`, `.logo-reveal`) that start at first paint and never wait for JavaScript.
- **Page heroes**: `components/heroes` — `HeroVisuals` (arch, bridge, fan, triptych, mosaic, process, threads, stack, signal), `HeroStage` (pointer + scroll depth for `[data-depth]` layers) and `Fabric3DLayer` (lazy live fabric with palettes in `lib/fabric-palettes.ts`).
- **Navbar**: hides immediately on scroll down and reveals on scroll up, using frame-synced, threshold-based logic (`SiteHeader.tsx`); `html[data-header]` drives `.sticky-under-header`.
- **Below the fold**: `MotionProvider` drives `data-reveal`, `data-split`, `data-draw`, `data-parallax`, `data-mask`, `data-stagger` with GSAP ScrollTrigger, set up when the browser is idle.
- **Signature pieces**: 3D satin hero (React Three Fiber, custom shader), sticky journey storytelling, pinned horizontal gallery, animated world map.
- **Interaction**: Motion (`LazyMotion` + `m`) for menus, dialogs, accordions and toasts.
- Content is never hidden without JavaScript, and a 3-second failsafe reveals everything if scripts stall.

## Accessibility standards

Target WCAG 2.2 AA, verified with axe on 11 page types at desktop and mobile (no serious or critical violations). Semantic landmarks, one H1 per page, skip links, visible focus rings, keyboard-operable menus, tabs, accordions and lightbox (focus trapping and return), 44 px touch targets, `prefers-reduced-motion` respected (no 3D, no scroll animation, no auto-moving elements), form errors announced and focus moved to the first invalid field.
