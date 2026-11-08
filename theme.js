(() => {
  const STORAGE_KEY = "site-theme";
  const DARK_QUERY = "(prefers-color-scheme: dark)";

  const readStoredTheme = () => {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  const systemTheme = () => (window.matchMedia(DARK_QUERY).matches ? "dark" : "light");
  const activeTheme = () => readStoredTheme() ?? systemTheme();

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  };

  const storeTheme = (theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The theme still applies to this page when persistent storage is unavailable.
    }
  };

  const updateControls = (theme) => {
    document.querySelectorAll("[data-theme-toggle]").forEach((control) => {
      const nextTheme = theme === "dark" ? "light" : "dark";
      const localizedTheme = nextTheme === "dark" ? "深色" : "浅色";
      control.setAttribute("aria-label", `切换到${localizedTheme}主题`);
      control.setAttribute("title", `切换到${localizedTheme}主题`);
      control.setAttribute("aria-pressed", String(theme === "dark"));
      const label = control.querySelector("[data-theme-label]");
      if (label) label.textContent = nextTheme === "dark" ? "Dark" : "Light";
    });
  };

  applyTheme(activeTheme());

  document.addEventListener("DOMContentLoaded", () => {
    updateControls(activeTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach((control) => {
      control.addEventListener("click", () => {
        const nextTheme = activeTheme() === "dark" ? "light" : "dark";
        storeTheme(nextTheme);
        applyTheme(nextTheme);
        updateControls(nextTheme);
      });
    });

    window.matchMedia(DARK_QUERY).addEventListener("change", (event) => {
      if (readStoredTheme()) return;
      const theme = event.matches ? "dark" : "light";
      applyTheme(theme);
      updateControls(theme);
    });
  });
})();
