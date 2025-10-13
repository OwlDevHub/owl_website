import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faCloudArrowDown,
  faScaleBalanced,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MOTION } from "../../styles/motionConfig";

const Header = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 25 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  if (isMobile) {
    return (
      <motion.header
        className="mobile-header"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION}
      >
        <div className="header-content mobile-header-content">
          <button
            className="mobile-burger"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Open menu"
            style={{ marginLeft: "auto", color: "var(--fg)" }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu-overlay"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="mobile-menu"
                onClick={(e) => e.stopPropagation()}
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <a
                  href="/terms"
                  className="navbar_button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faScaleBalanced} /> TERMS
                </a>
                <a
                  href="/privacy"
                  className="navbar_button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faLightbulb} /> PRIVACY
                </a>
                <a
                  href="#download_app"
                  className="navbar_button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  } else {
    return (
      <motion.header
        className="header"
        ref={ref}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
        transition={MOTION}
      >
        <motion.a href="/terms" className="navbar_button">
          <FontAwesomeIcon icon={faScaleBalanced} />
          TERMS
        </motion.a>
        <motion.a className="navbar_button" href="/privacy">
          <FontAwesomeIcon icon={faLightbulb} /> PRIVACY
        </motion.a>
        <motion.a href="#download_app" className="navbar_button">
          <FontAwesomeIcon icon={faCloudArrowDown} /> DOWNLOAD
        </motion.a>
      </motion.header>
    );
  }
};

export default Header;
