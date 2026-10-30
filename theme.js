const THEME_KEY = 'atlas-gis-theme';
const root = document.documentElement;
const toggle = document.querySelector('#themeToggle');

let theme = 'dark';
try {
  theme = localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
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
