import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import { Hamburger, X } from "@phosphor-icons/react";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth <= 768);
    });
  }, []);

  const listItems = [
    <li key="home">
      <a href="/">Home</a>
    </li>,
    <li key="petting-zoo">
      <a href="/petting-zoo">Petting Zoo</a>
    </li>,
    <li key="blog">
      <a href="/blog">Blog</a>
    </li>,
  ];

  return (
    <div className={`${styles.navbar}`}>
      <div className={styles.navLogo}>
        <a href="/">My Cool Site</a>
        <span className={styles.disclaimer}>* work in progress</span>
      </div>
      {isMobile && (
        <div>
          <button className={styles.menuButton} onClick={handleMenuToggle}>
            {isMobileMenuOpen ? <X /> : <Hamburger />}
          </button>
          {isMobileMenuOpen && (
            <div className={styles.overlay} onClick={handleMenuToggle}>
              <ul className={styles.mobileMenu}>{listItems}</ul>
            </div>
          )}
        </div>
      )}
      {!isMobile && (
        <div>
          <ul className={styles.navItems}>{listItems}</ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
