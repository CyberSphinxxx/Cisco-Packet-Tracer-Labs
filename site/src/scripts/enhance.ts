/**
 * Progressive enhancement only. Every page is complete and navigable without
 * JavaScript; these behaviours add a theme toggle, a collapsible mobile menu
 * and copy buttons on code blocks.
 */

const THEME_KEY = 'ptl-theme';

function storedTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function resolvedTheme(): 'light' | 'dark' {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncThemeUi() {
  const theme = resolvedTheme();
  document.documentElement.dataset.resolvedTheme = theme;
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
  }
}

function initTheme() {
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const next = resolvedTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* storage unavailable: theme still applies for this page view */
      }
      syncThemeUi();
    });
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!storedTheme()) syncThemeUi();
  });
  syncThemeUi();
}

function initMenu() {
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.hidden = false;
  const setOpen = (open: boolean, returnFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.toggleAttribute('data-open', open);
    if (open) nav.querySelector<HTMLAnchorElement>('a')?.focus();
    else if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(t) && !toggle.contains(t)) setOpen(false);
  });
}

function initCopyButtons() {
  if (!navigator.clipboard) return;
  for (const btn of document.querySelectorAll<HTMLButtonElement>('.copy-code')) {
    const code = btn.parentElement?.querySelector('pre code');
    if (!code) continue;
    // Console blocks: copy the commands without their IOS prompts so they paste straight into the CLI.
    const withPrompts = Boolean(code.querySelector('.ios-prompt'));
    const label = withPrompts ? 'Copy commands' : 'Copy';
    btn.textContent = label;
    btn.hidden = false;
    btn.setAttribute('aria-label', withPrompts ? 'Copy commands to clipboard, without prompts' : 'Copy code to clipboard');
    btn.addEventListener('click', async () => {
      let text = code.textContent ?? '';
      if (withPrompts) {
        const clone = code.cloneNode(true) as Element;
        for (const p of clone.querySelectorAll('.ios-prompt')) {
          const next = p.nextSibling;
          if (next?.nodeType === Node.TEXT_NODE) next.textContent = (next.textContent ?? '').replace(/^ /, '');
          p.remove();
        }
        text = clone.textContent ?? '';
      }
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied';
        btn.dataset.state = 'copied';
      } catch {
        btn.textContent = 'Copy failed';
      }
      setTimeout(() => {
        btn.textContent = label;
        delete btn.dataset.state;
      }, 2000);
    });
  }
}

/**
 * Instant navigation fallback. Browsers that support speculation rules get
 * them from the Speculation-Rules response header and prerender on hover.
 * Others fetch the page into the HTTP cache when the reader hovers or focuses
 * an internal link, so the click is served from cache (pages may be reused
 * for 60 seconds; see scripts/write-headers.mjs).
 */
function initPrefetchFallback() {
  if (typeof HTMLScriptElement !== 'undefined' && 'supports' in HTMLScriptElement && HTMLScriptElement.supports('speculationrules')) return;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return;
  const base = document.documentElement.dataset.base ?? '/';
  const skip = /\/(search|pagefind)\/|\.(pkt|png|txt|xml|json)$/i;
  const done = new Set<string>();
  const useLink = document.createElement('link').relList?.supports?.('prefetch') ?? false;
  let timer: number | undefined;
  const warm = (a: HTMLAnchorElement) => {
    const url = new URL(a.href, location.href);
    url.hash = '';
    if (url.origin !== location.origin || !url.pathname.startsWith(base) || skip.test(url.pathname)) return;
    if (a.hasAttribute('download') || a.target || url.href === location.href.split('#')[0] || done.has(url.href)) return;
    done.add(url.href);
    if (useLink) {
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = url.href;
      document.head.append(l);
    } else {
      fetch(url.href, { credentials: 'same-origin', priority: 'low' } as RequestInit).catch(() => done.delete(url.href));
    }
  };
  const onIntent = (e: Event) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => warm(a), e.type === 'pointerover' ? 80 : 0);
  };
  document.addEventListener('pointerover', onIntent, { passive: true });
  document.addEventListener('focusin', onIntent);
  document.addEventListener('touchstart', onIntent, { passive: true });
}

initTheme();
initMenu();
initPrefetchFallback();
initCopyButtons();
