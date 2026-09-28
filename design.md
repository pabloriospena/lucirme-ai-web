# Design System & Guidelines — LucirMe AI

## 1. Overview & Brand Identity

LucirMe AI is built on a clean, professional, high-contrast light theme inspired by Notion and modern developer documentation. The design prioritizes content legibility, fast scanability, and focused action without clutter, distracting heavy gradients, or unsolicited emojis.

- **Primary Goal:** Turn complex AI implementation into clear, actionable, high-ROI outcomes for professionals and enterprise teams.
- **Visual Aesthetic:** Minimalist Notion-style layout, high-contrast typography, crisp border hairlines (`border-gray-100` / `#E9E9E7`), and purposeful accent colors.

---

## 2. Color System & Tokens

### Primary Brand Palette
- **Deep Slate (`--color-deep`):** `#0F172A` (Slate 900) — Used for primary headings, high-priority text, and dark headers.
- **Teal Accent (`--color-teal`):** `#0D9488` (Teal 600) — Used for primary interactive actions, links, and success states.
- **Orange Energy (`--color-orange`):** `#EA580C` (Orange 600) — Used for high-urgency call-to-actions, badges, and key highlight triggers.
- **Emerald Green:** `#059669` (Emerald 600) — Used for direct WhatsApp links and conversion buttons.
- **Amber Gold:** `#F59E0B` (Amber 500) — Used for course highlights, featured products, and premium tags.

### Neutrals & Backgrounds
- **App Background:** `#F8FAFC` (Slate 50)
- **Notion Document Background:** `#FBFBFA` / `#FFFFFF`
- **Callout Background:** `#F1F1EF` / `#F7F7F5`
- **Border Hairline:** `#E9E9E7` / `#E2E8F0`
- **Muted Text (`--color-gray-mid`):** `#64748B` (Slate 500)
- **Subtle Gray (`--color-gray-light`):** `#E2E8F0` (Slate 200)

---

## 3. Typography & Hierarchy

### Font Family
- **Body & Headings:** System Sans-Serif Stack (`font-sans` with `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`).
- **Code & Metadata:** Monospace (`font-mono`).

### Scale & Hierarchy
- **H1 (Page Title):** `text-3xl` to `text-4xl`, `font-bold` / `font-extrabold`, `tracking-tight` (`#0F172A`).
- **H2 (Section Header):** `text-2xl`, `font-bold`, `tracking-tight`.
- **H3 (Card Header):** `text-lg` / `text-xl`, `font-semibold`.
- **Body Text:** `text-sm` (14px) / `text-base` (16px), `leading-relaxed`, `text-gray-600` or `#5A5A58`.
- **Labels & Micro-copy:** `text-xs` (12px) / `text-[11px]`, `font-medium` or `font-semibold`.

---

## 4. Layout Architecture & Structural Components

### Notion-Style Collapsible Sidebar
- **Collapsed Width:** `w-12` (48px) with icon-only view.
- **Expanded Width:** `w-60` (240px) with brand title and full navigation labels.
- **Mobile Backdrop:** Overlay with `bg-[#0F172A]/30 backdrop-blur-xs` on mobile drawer expansion.
- **Navigation Sections:** Soluciones, Recursos, Sobre Mí, Casos Reales, Termómetro IA, WhatsApp.

### Sticky Header & Mini-Banner
- **Mini-Header Promotion:** Dark Slate background (`#0F172A`) with pulsing Amber badge (`#F59E0B`) highlighting featured courses.
- **Top Bar:** Glassmorphism backdrop blur (`bg-white/90 backdrop-blur`) with logo, authentication status (Clerk), focus trigger button, and primary WhatsApp CTA.

---

## 5. UI Components & Pattern Standards

### Cards & Container Radii
- **Card Padding:** `p-4` to `p-6` depending on density.
- **Border Radius:** Maximum `rounded-xl` (12px–16px) for cards; `rounded-lg` for buttons and inputs; `rounded-full` reserved for badges/pills.
- **Borders & Elevation:** Hairline borders (`border border-[#E9E9E7]`) with subtle `shadow-2xs` or `shadow-sm`. Avoid heavy drop shadows or glassmorphism glow.

### Buttons & CTAs
- **Primary Action (Teal):** `bg-[#0D9488] text-white hover:bg-[#0F766E] font-bold rounded-lg transition`.
- **Urgent / Conversion (Orange/Amber):** `bg-[#EA580C] text-white hover:bg-[#C2410C]` or `bg-[#F59E0B] text-slate-950 font-black`.
- **Direct Messaging (WhatsApp):** `bg-emerald-600 text-white hover:bg-emerald-500 font-bold rounded-lg`.
- **Secondary / Ghost:** `bg-white border border-gray-200 hover:bg-gray-50 text-gray-700`.

### Iconography
- **Vector First:** Standardized inline SVG icons (`stroke-width="1.5"` or `2.0`).
- **No Emojis Policy:** Emojis are avoided in formal documents and B2B proposals (such as corporate guides and PRDs) to maintain a clean, executive aesthetic.

---

## 6. Document & Proposal Layouts (e.g. Siigo Copilot Guide)

- **Header Metadata Block:** Grey background (`#F7F7F5`), 2-column key-value grid for Recipient, Organization, Author, and Objective.
- **Callout Box:** Light gray border and background (`#F1F1EF`) with info icon for Executive Summaries.
- **Tier Comparative Cards:** Parallel comparison cards separating *Microsoft Suite (Included)* from *Pro Integrations (Advanced)*.
- **Interactive Features:** Filter buttons (`All`, `Microsoft Suite`, `Pro`), copyable prompt snippets with toast feedback, and print/export actions.

---

## 7. Responsiveness & Accessibility

- **Mobile First:** Touch target sizes strictly $\ge 44\text{px}$.
- **Contrast Ratios:** Text vs Background strictly complies with WCAG AA standards (minimum 4.5:1 ratio).
- **Smooth Scroll:** Enabled globally via `html.scroll-smooth`.
