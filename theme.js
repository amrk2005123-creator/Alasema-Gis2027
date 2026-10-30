const THEME_KEY = 'atlas-gis-theme';
const root = document.documentElement;
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

// Keep the selected theme if a viewer/PDF script changes the document theme
// or the browser restores this page after returning from a PDF view.
const themeGuard = new MutationObserver(() => {
  if (root.dataset.theme !== theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }
});
themeGuard.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
window.addEventListener('pageshow', () => applyTheme(readSavedTheme()));
window.addEventListener('storage', event => {
  if (event.key === THEME_KEY) applyTheme(readSavedTheme());
});
document.addEventListener('click', event => {
  if (event.target.closest('#showMap, #showPdf, #closeViewer, [data-open]')) {
    requestAnimationFrame(() => applyTheme(readSavedTheme()));
  }
});
