const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.theme = newTheme;
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="
      h-10
    bg-[#6C63FF] p-2 rounded cursor-pointer
    hover:bg-[#5a53e0]
    focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50
    transition-colors duration-200
  "
      title="Toggle theme"
    >
      {theme === "light" ? (
        <img
          src="/assets/images/Vector.svg"
          alt="Dark mode"
          className="w-5 h-5"
        />
      ) : (
        <img
          src="/assets/images/sun.svg"
          alt="Light mode"
          className="w-5 h-5"
        />
      )}
    </button>
  );
};

export default ThemeToggle;
