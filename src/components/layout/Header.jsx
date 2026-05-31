import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

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

  if (isMobile) {
    return (
      <header className="mobile-header">
        <button
          className="mobile-burger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          OWL
          <FontAwesomeIcon icon={faBars} />
        </button>
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
              <a href="/terms" onClick={() => setMenuOpen(false)}>
                TERMS
              </a>
              <a href="/privacy" onClick={() => setMenuOpen(false)}>
                PRIVACY
              </a>
              <a href="#download_app" onClick={() => setMenuOpen(false)}>
                DOWNLOAD
              </a>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="header">
      <a href="/terms">TERMS</a>
      <a href="/privacy">PRIVACY</a>
      <a href="#download_app">DOWNLOAD</a>
    </header>
  );
};

export default Header;
