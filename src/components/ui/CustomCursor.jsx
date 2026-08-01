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

const getCursorLabel = (el) => {
  if (!el) return { label: null, iconHTML: null };

  const card = el.closest(".feature-card");
  if (card) {
    const iconEl = card.querySelector(".feature-icon");
    return { label: "VIEW", iconHTML: iconEl ? iconEl.innerHTML : null };
  }

  const navLink = el.closest(".header-nav a");
  if (navLink) {
    return { label: "\u2192", iconHTML: null };
  }

  const downloadBtn = el.closest(".download-button");
  if (downloadBtn) {
    const iconEl = downloadBtn.querySelector("svg");
    return { label: "NOTIFY ME", iconHTML: iconEl ? iconEl.outerHTML : null };
  }

  const contactBtn = el.closest(".contact_button");
  if (contactBtn) {
    return { label: contactBtn.getAttribute("aria-label") || "", iconHTML: null };
  }

  const interactive = el.closest(
    "a, button, textarea, select, [role=button], [role=link]",
  );
  if (interactive) {
    if (interactive.matches(".slider__btn-prev")) {
      return { label: "PREV", iconHTML: null };
    }
    if (interactive.matches(".slider__btn-next")) {
      return { label: "NEXT", iconHTML: null };
    }
    const txt = interactive.textContent || interactive.innerText || "";
    return { label: txt.trim().slice(0, 16) || "", iconHTML: null };
  }

  return { label: null, iconHTML: null };
};

const CustomCursor = () => {
  const [canHover, setCanHover] = useState(false);
  const [label, setLabel] = useState(null);
  const [iconHTML, setIconHTML] = useState(null);
  const iconRef = useRef(null);
  const devToolsOpen = useDevToolsDetector();
  const labelRef = useRef({ label: null, iconHTML: null });

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

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      const current = labelRef.current;
      const next = getCursorLabel(el);
      if (next.label !== current.label || next.iconHTML !== current.iconHTML) {
        labelRef.current = next;
        setLabel(next.label);
        setIconHTML(next.iconHTML);
      }
    };

    document.addEventListener("mousemove", move);

    return () => {
      document.removeEventListener("mousemove", move);
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
        fontFamily: "Archivo, sans-serif",
        fontSize: 12,
        letterSpacing: 0.5,
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
