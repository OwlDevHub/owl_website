import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DURATION = 2200;
const MIN_VISIBLE = 2000;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const Preloader = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    const start = startRef.current;
    const animate = () => {
      const elapsed = Date.now() - start;
      const raw = Math.min(elapsed / DURATION, 1);
      setProgress(Math.round(easeOutCubic(raw) * 100));
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_VISIBLE - elapsed);
    const timer = setTimeout(() => {
      if (fontsReady || Date.now() - startRef.current > 5000) {
        setShow(false);
      }
    }, remaining);
    return () => clearTimeout(timer);
  }, [fontsReady, show]);

  return (
    <div className="preloader-root">
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="preloader"
            className="preloader"
            initial={{ opacity: 1 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="preloader-content">
              <span className="preloader-number">{progress}</span>
              <span className="preloader-percent">%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="preloader-children" style={{ visibility: show ? "hidden" : "visible" }}>
        {children}
      </div>
    </div>
  );
};

export default Preloader;
