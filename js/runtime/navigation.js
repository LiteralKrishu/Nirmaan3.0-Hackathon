import { h, invalidate } from './dom.js';
const scrollPositions = new Map();
export function navigate(href, replace = false, options = {}) {
  const url = new URL(href, location.href);
  if (url.origin !== location.origin) { location.assign(url.href); return; }
  scrollPositions.set(location.href, window.scrollY);
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
  invalidate();
  if (options.scroll !== false) requestAnimationFrame(() => {
    if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView();
    else window.scrollTo(0, 0);
  });
}
const router = { push: (url, options) => navigate(url, false, options), replace: (url, options) => navigate(url, true, options), back: () => history.back(), refresh: invalidate, prefetch: () => {} };
export const useRouter = () => router;
export const usePathname = () => location.pathname.replace(/\/$/, '') || '/';
let lastSearch, searchParams;
export function useSearchParams() {
  if (lastSearch !== location.search) { lastSearch = location.search; searchParams = new URLSearchParams(lastSearch); }
  return searchParams;
}
export default function Link({ href, children, onClick, prefetch, replace, scroll, ...props }) {
  return h('a', { ...props, href, onClick: event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || props.target === '_blank' || props.download != null) return;
    const url = new URL(href, location.href);
    if (url.origin === location.origin) { event.preventDefault(); navigate(href, replace, { scroll }); }
  } }, children);
}
window.addEventListener('popstate', () => { invalidate(); requestAnimationFrame(() => window.scrollTo(0, scrollPositions.get(location.href) || 0)); });
