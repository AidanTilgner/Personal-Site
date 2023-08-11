import React, { useState } from "react";
import styles from "./Navbar.module.scss";

function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div
      className={`${styles.navbar} ${
        isMobileMenuOpen ? styles.mobileMenu : ""
      }`}
    >
      <div className={styles.navLogo}>
        My Cool Site{" "}
        <span className={styles.disclaimer}>* work in progress</span>
      </div>
      <button onClick={handleMenuToggle}>Menu</button>
      <ul className={styles.navItems}>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/petting-zoo">Petting Zoo</a>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
