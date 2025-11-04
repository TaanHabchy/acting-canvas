export function ThemeToggle() {
    const toggleTheme = () => {
        const root = document.documentElement;
        const current = root.getAttribute("data-theme");
        root.setAttribute("data-theme", current === "light" ? "dark" : "light");
    };

    return (
        <button onClick={toggleTheme}>
            Toggle Theme
        </button>
    );
}
