import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StickyCtaBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      if (scrollY > windowH * 0.6 && scrollY < document.body.scrollHeight - windowH * 1.5) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sticky-cta"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a className="sticky-cta-button" href="#download_app">
            Get Early Access
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCtaBar;
