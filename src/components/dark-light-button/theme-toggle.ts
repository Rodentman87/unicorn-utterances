const COLOR_MODE_STORAGE_KEY = "currentTheme";

export const themeToggle = () => {
	const themeToggleBtn: HTMLElement = document.querySelector(
		"#theme-toggle-button"
	);
	if (!themeToggleBtn) return;
	const darkIconEl: HTMLElement = document.querySelector("#dark-icon");
	const lightIconEl: HTMLElement = document.querySelector("#light-icon");
	function toggleButton(theme) {
		themeToggleBtn.ariaPressed = `${theme === "dark"}`;
		if (theme === "light") {
			lightIconEl.style.display = null;
			darkIconEl.style.display = "none";
		} else {
			lightIconEl.style.display = "none";
			darkIconEl.style.display = null;
		}
		setTimeout(
			() => (window as any).reloadDisqus && (window as any).reloadDisqus(),
			100
		);
	}

	// TODO: Migrate to `classList`
	const initialTheme = document.documentElement.className;
	toggleButton(initialTheme);
	themeToggleBtn.addEventListener("click", () => {
		const currentTheme = document.documentElement.className;
		document.documentElement.className =
			currentTheme === "light" ? "dark" : "light";
		// TODO: Persist new setting
		const newTheme = document.documentElement.className;
		toggleButton(newTheme);
		localStorage.setItem(COLOR_MODE_STORAGE_KEY, newTheme);
	});
};
