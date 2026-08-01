import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const DEVTOOLS_THRESHOLD = 160;

const useDevToolsDetector = () => {
  const [isOpen, setIsOpen] = useState(false);

  const check = useCallback(() => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    return widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD;
  }, []);

  useEffect(() => {
    setIsOpen(check());

    const onResize = () => setIsOpen(check());
    window.addEventListener("resize", onResize);

    const interval = setInterval(() => setIsOpen(check()), 1000);

    const onKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["I", "C", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        setTimeout(() => setIsOpen(check()), 500);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      clearInterval(interval);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [check]);

  return isOpen;
};

const CustomCursor = () => {
  const [canHover, setCanHover] = useState(false);
  const devToolsOpen = useDevToolsDetector();

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("devtools-open", devToolsOpen);
  }, [devToolsOpen]);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 2000, damping: 120 });
  const springY = useSpring(mouseY, { stiffness: 2000, damping: 120 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    document.addEventListener("mousemove", move);

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, [mouseX, mouseY]);

  if (!canHover || devToolsOpen) return null;

  return (
    <motion.div
      className="custom-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "var(--fg)",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 1,
      }}
    />
  );
};

export default CustomCursor;
