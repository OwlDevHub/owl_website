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

const THEMES = {
  "mono-dark": {
    classes: [],
    label: "Mono Dark",
    icon: faMoon,
    opposite: "mono-light",
    bg: "#101010",
  },
  "mono-light": {
    classes: ["light"],
    label: "Mono Light",
    icon: faSun,
    opposite: "mono-dark",
    bg: "#e8e8e8",
  },
  "everforest-dark": {
    classes: ["everforest"],
    label: "Forest Dark",
    icon: faMoon,
    opposite: "everforest-light",
    bg: "#1e2326",
  },
  "everforest-light": {
    classes: ["everforest", "light"],
    label: "Forest Light",
    icon: faSun,
    opposite: "everforest-dark",
    bg: "#f3efda",
  },
};

const useTheme = () => {
  const [themeName, setThemeName] = useState("mono-dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved && THEMES[saved]) {
      setThemeName(saved);
      document.documentElement.classList.remove("light", "everforest");
      THEMES[saved].classes.forEach((c) =>
        document.documentElement.classList.add(c),
      );
    }
  }, []);

  const applyTheme = useCallback((name) => {
    document.documentElement.classList.remove("light", "everforest");
    THEMES[name].classes.forEach((c) =>
      document.documentElement.classList.add(c),
    );
    localStorage.setItem("theme", name);
    setThemeName(name);
  }, []);

  const isDark = themeName.endsWith("-dark");

  return { themeName, applyTheme, isDark };
};

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false);
  const { themeName, applyTheme } = useTheme();

  const [animating, setAnimating] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [overlayColor, setOverlayColor] = useState("#101010");
  const [transitionKey, setTransitionKey] = useState(0);
  const toggleRef = useRef(null);
  const transitioningRef = useRef(false);
  const longPressTimer = useRef(null);
  const menuRef = useRef(null);
  const themeMenuOpenRef = useRef(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!themeMenuOpen) return;
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setThemeMenuOpen(false);
        themeMenuOpenRef.current = false;
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [themeMenuOpen]);

  const animateToTheme = useCallback(
    (target) => {
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
      setOverlayColor(THEMES[target].bg);
      setTransitionKey((k) => k + 1);
      setAnimating(true);

      setTimeout(() => {
        applyTheme(target);
      }, 280);

      setTimeout(() => {
        setAnimating(false);
        transitioningRef.current = false;
      }, 700);
    },
    [applyTheme],
  );

  const handlePointerDown = useCallback(() => {
    themeMenuOpenRef.current = false;
    longPressTimer.current = setTimeout(() => {
      themeMenuOpenRef.current = true;
      setThemeMenuOpen(true);
    }, 400);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!themeMenuOpenRef.current) {
      const next = THEMES[themeName].opposite;
      animateToTheme(next);
    }
  }, [themeName, animateToTheme]);

  const handlePointerLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleMenuSelect = useCallback(
    (name) => {
      setThemeMenuOpen(false);
      themeMenuOpenRef.current = false;
      animateToTheme(name);
    },
    [animateToTheme],
  );

  const links = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#download_app", label: "Download" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  const handleNavClick = () => {
    setMenuOpen(false);
    setMobileThemeOpen(false);
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
              onClick={() => {
                setMenuOpen(false);
                setMobileThemeOpen(false);
              }}
            >
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <button
                  className="mobile-menu-close"
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileThemeOpen(false);
                  }}
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
                  onClick={() => setMobileThemeOpen((v) => !v)}
                >
                  Theme
                </button>
                {mobileThemeOpen && (
                  <div
                    className="mobile-theme-backdrop"
                    onClick={() => setMobileThemeOpen(false)}
                  >
                    <div
                      className="mobile-theme-submenu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.entries(THEMES).map(([key, data]) => (
                        <button
                          key={key}
                          className={`mobile-theme-card${themeName === key ? " active" : ""}`}
                          onClick={() => {
                            animateToTheme(key);
                            setMenuOpen(false);
                            setMobileThemeOpen(false);
                          }}
                        >
                          <span
                            className="mobile-theme-swatch"
                            style={{ backgroundColor: data.bg }}
                          />
                          <span className="mobile-theme-label">
                            {data.label}
                          </span>
                          {themeName === key && (
                            <span className="mobile-theme-check">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
              <div className="theme-toggle-wrapper">
                <button
                  ref={toggleRef}
                  className="theme-toggle"
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerLeave}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-label="Toggle theme"
                >
                  <FontAwesomeIcon icon={THEMES[themeName].icon} />
                </button>
                <AnimatePresence>
                  {themeMenuOpen && (
                    <motion.div
                      ref={menuRef}
                      className="theme-menu"
                      initial={{ opacity: 0, scale: 0.92, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      {Object.entries(THEMES).map(([key, data]) => (
                        <button
                          key={key}
                          className={`theme-menu-item${themeName === key ? " active" : ""}`}
                          onClick={() => handleMenuSelect(key)}
                        >
                          <span
                            className="theme-menu-swatch"
                            style={{ backgroundColor: data.bg }}
                          />
                          <span>{data.label}</span>
                          {themeName === key && (
                            <span className="theme-menu-check" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
