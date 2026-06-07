import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { OwlIcon } from "../ui";

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        <header className="mobile-header">
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
            <div
              className="mobile-menu"
              onClick={(e) => e.stopPropagation()}
            >
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
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <header className="header">
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
