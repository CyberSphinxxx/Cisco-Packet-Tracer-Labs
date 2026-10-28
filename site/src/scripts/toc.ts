/** Highlight the TOC entry for the section currently being read. */
const links = [...document.querySelectorAll<HTMLAnchorElement>('.toc-sidebar a[href^="#"]')];
const targets = links
  .map((a) => ({ a, el: document.getElementById(decodeURIComponent(a.hash.slice(1))) }))
  .filter((t): t is { a: HTMLAnchorElement; el: HTMLElement } => t.el !== null);

if (targets.length) {
  let scheduled = false;
  let currentLink: HTMLAnchorElement | null = null;
  const update = () => {
    scheduled = false;
    const line = 140; // px below the viewport top (sticky header + breathing room)
    let current = targets[0];
    for (const t of targets) {
      if (t.el.getBoundingClientRect().top - line <= 0) current = t;
      else break;
    }
    if (current.a === currentLink) return;
    currentLink?.removeAttribute('aria-current');
    current.a.setAttribute('aria-current', 'true');
    currentLink = current.a;
  };
  const onScroll = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}
