const THEME_KEY = 'atlas-gis-theme';
const root = document.documentElement;
const page = document.body;
const app = document.querySelector('#app');
const toggle = document.querySelector('#themeToggle');

let theme = 'dark';
function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}
try {
  theme = readSavedTheme();
} catch {
  // Keep the dark default if browser storage is unavailable.
}

function applyTheme(nextTheme) {
  theme = nextTheme === 'light' ? 'light' : 'dark';
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  page.dataset.theme = theme;
  if (app) app.dataset.theme = theme;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === 'light' ? '#f2f1f8' : '#000000';
  if (toggle) {
    const nextLabel = theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن';
    toggle.setAttribute('aria-label', nextLabel);
    toggle.setAttribute('title', nextLabel);
    toggle.setAttribute('aria-pressed', String(theme === 'light'));
    toggle.textContent = theme === 'dark' ? '☼' : '☾';
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The selected theme still applies for this page when storage is unavailable.
  }
}

applyTheme(theme);
toggle?.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));

// Reapply the saved theme after the map dialog, PDF canvas, browser history,
// or back-forward cache changes the visible page state.
function restoreSavedTheme() {
  applyTheme(readSavedTheme());
}
// The map/PDF viewer is managed by the app module. Expose a tiny bridge so
// that viewer transitions can reassert the user's saved theme synchronously.
window.atlasRestoreSavedTheme = restoreSavedTheme;

const themeGuard = new MutationObserver(() => {
  if (root.dataset.theme !== theme || page.dataset.theme !== theme || (app && app.dataset.theme !== theme)) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    page.dataset.theme = theme;
    if (app) app.dataset.theme = theme;
  }
});
themeGuard.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
themeGuard.observe(page, { attributes: true, attributeFilter: ['data-theme', 'class'] });
if (app) themeGuard.observe(app, { attributes: true, attributeFilter: ['data-theme', 'class'] });

window.addEventListener('pageshow', restoreSavedTheme);
window.addEventListener('popstate', restoreSavedTheme);
window.addEventListener('hashchange', restoreSavedTheme);
window.addEventListener('focus', restoreSavedTheme);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) restoreSavedTheme();
});
window.addEventListener('storage', event => {
  if (event.key === THEME_KEY) restoreSavedTheme();
});
document.addEventListener('click', event => {
  if (event.target.closest('#showMap, #showPdf, #closeViewer, [data-open]')) {
    requestAnimationFrame(restoreSavedTheme);
    setTimeout(restoreSavedTheme, 120);
  }
});

const viewer = document.querySelector('#viewer');
if (viewer) {
  new MutationObserver(restoreSavedTheme).observe(viewer, {
    attributes: true,
    attributeFilter: ['hidden', 'class'],
  });
}
