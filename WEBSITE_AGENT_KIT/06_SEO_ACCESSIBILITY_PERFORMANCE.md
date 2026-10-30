# 06 — SEO, accessibility, performance and content truthfulness

## SEO

- Descriptive title and description per route using canonical metadata (no invented claims).
- `<html lang="en">`, actual logical headings, breadcrumbs, OG/Twitter metadata, correct canonical URL policy and sitemap for static generated routes.
- `@astrojs/sitemap` only after an actual production origin is provided, otherwise configurable safe preview/default behavior. Do not invent a production domain.
- robots policy: allow public release when configured; preview builds and PR previews should avoid being indexed if no production canonical exists. Sitemap must not list internal/private URLs.
- Schema.org `BreadcrumbList`/`LearningResource` only if fields accurately match page content. No fake ratings/reviews, accreditation, Cisco partnerships or guaranteed exam outcomes.
- HTTP redirects and URL normalization only if real need; stable paths for future growth.

## Accessibility

Aim WCAG 2.2 AA practices; verify with automated axe and actual keyboard/visual checks. Landmarks, visible focus, heading hierarchy, skip link, semantic buttons/links, icon labels, alt text for topology diagrams, keyboard-search/filters, accessible dialogs, reduced motion, color contrast. Avoid inaccessible code-copy buttons or menu focus traps.

## Performance

Static prerender first, no unnecessary client JS. Lazy-load offscreen images without causing layout shifts; avoid loading giant image bundles. Split search index with Pagefind. Track HTML/CSS/JS sizes, LCP-related image behavior, mobile performance, broken external fonts. Only make numeric claims if actually measured. Lighthouse or Web Vitals tests should be run when tools permit, with results saved and noted as lab environment dependent.

## Content integrity

Clear Cisco non-affiliation in about/footer, CC BY-SA content credit and MIT tooling distinction. Document that topology `.pkt` requires Packet Tracer software. Lab-only credentials in reference solutions should not be characterized as secure production defaults. State a lab's simulator status from source metadata without upgrading claims.
