import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
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

  const [animating, setAnimating] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [overlayColor, setOverlayColor] = useState("#1e2326");
  const [transitionKey, setTransitionKey] = useState(0);
  const toggleRef = useRef(null);
  const transitioningRef = useRef(false);

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
    if (animating) {
      document.documentElement.classList.add("theme-transitioning");
    } else {
      document.documentElement.classList.remove("theme-transitioning");
    }
    return () =>
      document.documentElement.classList.remove("theme-transitioning");
  }, [animating]);

  const animateThemeToggle = useCallback(() => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    let x, y;
    if (toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }

    setOrigin({ x, y });
    setOverlayColor(isDark ? "#ececec" : "#272727");
    setTransitionKey((k) => k + 1);
    setAnimating(true);

    setTimeout(() => {
      toggleTheme();
    }, 280);

    setTimeout(() => {
      setAnimating(false);
      transitioningRef.current = false;
    }, 700);
  }, [isDark, toggleTheme]);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#download_app", label: "Download" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      {isMobile ? (
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
                  <a
                    className="mobile-nav-button"
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  className="mobile-nav-button mobile-theme-toggle"
                  onClick={animateThemeToggle}
                >
                  Theme: {isDark ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
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
              <button
                ref={toggleRef}
                className="theme-toggle"
                onClick={animateThemeToggle}
                aria-label="Toggle theme"
              >
                <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
              </button>
            </nav>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        {animating && (
          <motion.div
            key={`theme-overlay-${transitionKey}`}
            className="theme-transition-overlay"
            initial={{
              clipPath: `circle(0% at ${origin.x}px ${origin.y}px)`,
            }}
            animate={{
              clipPath: `circle(141% at ${origin.x}px ${origin.y}px)`,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
              opacity: { duration: 0.3, ease: "easeIn" },
            }}
            style={{ backgroundColor: overlayColor }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
