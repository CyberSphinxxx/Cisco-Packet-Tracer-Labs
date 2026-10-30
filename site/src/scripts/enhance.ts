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
    btn.hidden = false;
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        btn.textContent = 'Copied';
        btn.dataset.state = 'copied';
      } catch {
        btn.textContent = 'Copy failed';
      }
      setTimeout(() => {
        btn.textContent = 'Copy';
        delete btn.dataset.state;
      }, 2000);
    });
  }
}

initTheme();
initMenu();
initCopyButtons();
