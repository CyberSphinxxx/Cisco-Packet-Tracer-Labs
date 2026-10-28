# 04 — UX/UI design system

## Aesthetic direction

A technical learning library that feels engineered rather than “vibe coded”: editorial hierarchy, strong grids, understated confidence, calm neutral surfaces with a single deliberate accent, legible code panels, crisp section dividers and thoughtful whitespace. Avoid oversized hero badges, emoji-decorated every heading, rainbow cards, and large glassmorphism panels. Use full browser width for structural layouts, but a controlled prose reading column for long tutorials.

## Tokens and components

Implement documented CSS variables for text/background/surface/border/primary/muted/focus, semantic success/warning status, spacing scale, radii, type scale, shadows, transitions, breakpoints. Light/dark themes must have contrast-appropriate colors. Use system-font fallback stacks; avoid downloading licensed fonts without clear rights.

Core primitives: SiteHeader, MobileNav, Footer, PageShell, Breadcrumbs, Typography, LabCard, FilterControls, TopicBadge, LabMeta, DownloadPanel, TopologyViewer, MarkdownProse, CodeBlock, TOC, Callout, LearningPathStep, SearchTrigger, StatusIndicator, EmptyState. Build real shared components, not duplicate inline one-off markup.

## Responsive strategy

- Mobile first, ~320px minimum viewport and normal touch targets.
- Header desktop: wordmark, concise nav, search and theme. Mobile: safe accessible menu.
- Home: impactful but not full-viewport contentless hero; visible learning action without scrolling.
- Catalog: sidebar filters desktop / collapsible filter panel mobile; cards with useful data without visual noise.
- Lab: slim optional left context/nav, readable central article, sticky optional right TOC on wide displays; no horizontal page overflow.
- Wide Markdown tables use scoped horizontal scrolling and captions; code blocks use horizontal scrolling and copy affordance.
- Diagram: responsive contain, view full size/open original; meaningful text alternative.
- Comfortable focus rings, skip-to-content, prefers-reduced-motion, labels, interactive semantics.

## Theme and motion

- First-load theme defaults to system; user toggle persists as optional progressive enhancement; SSR/static HTML must remain readable without JS.
- Any transitions should be subtle, interruptible, and disabled/reduced for reduced-motion preferences.
- No entrance animation required for primary content.

## Copy and content writing

Use precise networking terminology, beginner-friendly explanations, no fabricated metrics, minimal emojis, no em-dash-heavy UI copy. Distinguish tested simulator topologies from official Cisco training. Make solution download clearly labeled.

## Review gates

Check at 360px, 390px, 768px, 1024px, 1440px; keyboard-only nav, focus and Escape behavior, TOC offsets, code/table overflow, zoom 200%, reduced motion and high contrast. Capture actual screenshots when browser tooling is available. Do not claim visual verification without viewing a render.
