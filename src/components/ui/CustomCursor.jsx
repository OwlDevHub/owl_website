import { useEffect, useRef, useState, useCallback } from "react";
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
  const [label, setLabel] = useState(null);
  const [iconHTML, setIconHTML] = useState(null);
  const iconRef = useRef(null);
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

    const over = (e) => {
      const card = e.target.closest(".feature-card");
      if (card) {
        const iconEl = card.querySelector(".feature-icon");
        setLabel("VIEW");
        setIconHTML(iconEl ? iconEl.innerHTML : null);
        return;
      }
      const navLink = e.target.closest(".header-nav a");
      if (navLink) {
        setLabel("\u2192");
        setIconHTML(null);
        return;
      }
      const downloadBtn = e.target.closest(".download-button");
      if (downloadBtn) {
        const iconEl = downloadBtn.querySelector("svg");
        setLabel("NOTIFY ME");
        setIconHTML(iconEl ? iconEl.outerHTML : null);
        return;
      }
      const contactBtn = e.target.closest(".contact_button");
      if (contactBtn) {
        setLabel(contactBtn.getAttribute("aria-label") || "");
        setIconHTML(null);
        return;
      }

      const interactive = e.target.closest(
        "a, button, textarea, select, [role=button], [role=link]",
      );
      if (interactive) {
        if (interactive.matches(".slider__btn-prev")) {
          setLabel("PREV");
        } else if (interactive.matches(".slider__btn-next")) {
          setLabel("NEXT");
        } else {
          const txt = interactive.textContent || interactive.innerText || "";
          setLabel(txt.trim().slice(0, 16) || "");
        }
      } else {
        setLabel(null);
      }
      setIconHTML(null);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, [mouseX, mouseY]);

  if (!canHover || devToolsOpen) return null;

  return (
    <motion.div
      className={`custom-cursor${label ? " is-hovering" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        width: label ? (iconHTML ? 40 : label === "\u2192" ? 40 : 130) : 20,
        height: label ? 40 : 20,
        borderRadius: label ? 18 : "50%",
        backgroundColor: "var(--fg)",
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: iconHTML ? 6 : 0,
        opacity: 1,
        fontFamily: "Bebas Neue, sans-serif",
        fontSize: 13,
        letterSpacing: 2,
        color: "var(--bg)",
        fontWeight: 600,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {iconHTML ? (
        <span
          ref={iconRef}
          style={{ display: "flex", alignItems: "center", fontSize: 14 }}
          dangerouslySetInnerHTML={{ __html: iconHTML }}
        />
      ) : (
        label
      )}
    </motion.div>
  );
};

export default CustomCursor;
