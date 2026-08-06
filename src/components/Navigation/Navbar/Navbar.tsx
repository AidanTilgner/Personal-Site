import { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";

const navigation = [
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Writing" },
  { href: "/petting-zoo", label: "Petting zoo" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const updateScrollState = () => {
      const workspace = document.querySelector<HTMLElement>(
        "[data-workspace-scroll]",
      );
      const scrolled = window.scrollY > 16 || (workspace?.scrollTop ?? 0) > 16;
      setIsScrolled(scrolled);
      document.documentElement.dataset.navScrolled = String(scrolled);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", updateScrollState, {
      passive: true,
      capture: true,
    });
    updateScrollState();
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", updateScrollState, true);
      delete document.documentElement.dataset.navScrolled;
    };
  }, []);

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <a className={styles.identity} href="/" aria-label="Aidan Tilgner — home">
        Aidan Tilgner
      </a>

      <nav className={styles.desktopNav} aria-label="Primary navigation">
        {navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <button
        className={styles.menuButton}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
      >
        <span
          className={`${styles.menuIcon} ${isOpen ? styles.menuIconOpen : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <nav
          className={styles.mobileNav}
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <a className={styles.contact} href="mailto:aidantilgner02@gmail.com">
            Start a conversation
          </a>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
