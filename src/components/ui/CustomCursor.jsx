import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [label, setLabel] = useState(null);
  const [iconHTML, setIconHTML] = useState(null);
  const iconRef = useRef(null);

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
      const interactive = e.target.closest(
        "a, button, textarea, select, [role=button], [role=link]",
      );
      if (interactive) {
        if (interactive.matches(".slider__btn-prev")) {
          setLabel("PREV");
        } else if (interactive.matches(".slider__btn-next")) {
          setLabel("NEXT");
        } else {
          const txt =
            interactive.textContent || interactive.innerText || "";
          setLabel(txt.trim().slice(0, 16) || "CLICK");
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

  return (
    <motion.div
      className={`custom-cursor${label ? " is-hovering" : " custom-cursor--invert"}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        width: label ? (iconHTML ? 40 : 140) : 20,
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
