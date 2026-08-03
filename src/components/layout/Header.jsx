import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSun,
  faMoon,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { OwlIcon } from "../ui";

const THEMES = {
  dark: { icon: faMoon },
  light: { icon: faSun },
};

const useTheme = () => {
  const [themeName, setThemeName] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setThemeName("light");
    }
  }, []);

  const applyTheme = useCallback((name) => {
    document.documentElement.classList.toggle("light", name === "light");
    localStorage.setItem("theme", name);
    setThemeName(name);
  }, []);

  return { themeName, applyTheme };
};

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { themeName, applyTheme } = useTheme();

  const [openNav, setOpenNav] = useState(null);

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

  useEffect(() => {
    if (!openNav) return;
    const handler = (e) => {
      if (!e.target.closest(".nav-item, .nav-sub")) {
        setOpenNav(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openNav]);

  const handleToggleClick = useCallback(() => {
    applyTheme(themeName === "dark" ? "light" : "dark");
  }, [themeName, applyTheme]);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  const navGroups = [
    {
      id: "product",
      label: "Product",
      items: [
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
        { href: "#download_app", label: "Join Beta" },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      items: [
        { href: "#about", label: "About" },
        { href: "https://github.com/OwlDevHub", label: "GitHub" },
        { href: "https://t.me/W2N3098", label: "Community" },
      ],
    },
  ];

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {isMobile ? (
        <>
          <header className={`mobile-header${scrolled ? " scrolled" : ""}`}>
            <a href="/" className="header-logo">
              <OwlIcon />
              OWL
            </a>
            <div className="mobile-header-right">
              <div className="theme-toggle-wrapper">
                <button
                  className="theme-toggle"
                  onClick={handleToggleClick}
                  aria-label="Toggle theme"
                >
                  <FontAwesomeIcon icon={THEMES[themeName].icon} />
                </button>
              </div>
              <button
                className="mobile-burger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open menu"
              >
                Menu
                <FontAwesomeIcon icon={faBars} />
              </button>
            </div>
          </header>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                onClick={() => setMenuOpen(false)}
              >
                <motion.div
                  className="mobile-menu"
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {links.map((link) =>
                    link.href.startsWith("#") ? (
                      <a
                        className="mobile-nav-button"
                        key={link.href}
                        href={link.href}
                        onClick={handleNavClick}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        className="mobile-nav-button"
                        key={link.href}
                        to={link.href}
                        onClick={handleNavClick}
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                  <a
                    className="mobile-nav-button"
                    href="#download_app"
                    onClick={handleNavClick}
                  >
                    Join Beta
                  </a>
                  <button
                    className="mobile-menu-close"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <header className={`header${scrolled ? " scrolled" : ""}`}>
          <div className="header-inner">
            <a href="/" className="header-logo">
              <OwlIcon />
              OWL
            </a>
            <nav className="header-nav">
              {navGroups.map((group) => (
                <div key={group.id} style={{ position: "relative" }}>
                  <button
                    className={`nav-item${openNav === group.id ? " open" : ""}`}
                    onClick={() =>
                      setOpenNav((v) => (v === group.id ? null : group.id))
                    }
                    aria-haspopup="true"
                    aria-expanded={openNav === group.id}
                  >
                    {group.label}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                  <AnimatePresence>
                    {openNav === group.id && (
                      <motion.div
                        className="nav-sub"
                        initial={{ opacity: 0, x: "-50%", y: -6 }}
                        animate={{ opacity: 1, x: "-50%", y: 0 }}
                        exit={{ opacity: 0, x: "-50%", y: -6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        {group.items.map((item) =>
                          item.href.startsWith("/") ? (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="nav-sub-link"
                              onClick={() => setOpenNav(null)}
                            >
                              {item.label}
                            </Link>
                          ) : item.href.startsWith("#") ? (
                            <a
                              key={item.label}
                              href={item.href}
                              className="nav-sub-link"
                              onClick={() => setOpenNav(null)}
                            >
                              {item.label}
                            </a>
                          ) : (
                            <a
                              key={item.label}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="nav-sub-link"
                              onClick={() => setOpenNav(null)}
                            >
                              {item.label}
                            </a>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <a href="#pricing" className="nav-item">
                Pricing
              </a>
              <a href="#about" className="nav-item">
                About
              </a>
            </nav>
            <div className="header-nav-right">
              <div className="theme-toggle-wrapper">
                <button
                  className="theme-toggle"
                  onClick={handleToggleClick}
                  aria-label="Toggle theme"
                >
                  <FontAwesomeIcon icon={THEMES[themeName].icon} />
                </button>
              </div>
              <a href="#download_app" className="btn btn--primary btn--sm">
                Join Beta
              </a>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
