import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { OwlIcon } from "../ui";

const useTheme = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", !next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggle };
};

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleResize();
    handleScroll();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#download_app", label: "Download" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  const handleNavClick = () => setMenuOpen(false);

  if (isMobile) {
    return (
      <>
        <header className={`mobile-header${scrolled ? " scrolled" : ""}`}>
          <a href="/" className="header-logo">
            <OwlIcon />
            OWL
          </a>
          <button
            className="mobile-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            Menu
            <FontAwesomeIcon icon={faBars} />
          </button>
        </header>
        {menuOpen && (
          <div
            className="mobile-menu-overlay"
            onClick={() => setMenuOpen(false)}
          >
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={handleNavClick}>
                  {link.label}
                </a>
              ))}
              <button
                className="header-cta"
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                }}
              >
                <FontAwesomeIcon icon={isDark ? faSun : faMoon} />{" "}
                {isDark ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="header-inner">
        <a href="/" className="header-logo">
          <OwlIcon />
          OWL
        </a>
        <nav className="header-nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#download_app">Download</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a className="header-cta" href="#download_app">
            Get Early Access
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
